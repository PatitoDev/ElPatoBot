import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import http from 'http';
import { BaseEvent, ConnectEvent, QuackEvent } from '@elpatobot/events';
import ws from 'ws';
import TwitchClient from './twitchClient';
import { ChannelQuacksResponse, UserQuacksResponse } from '@elpatobot/responses';
import InMemoryCache from './InMemoryCache';
import twitchApi from './twitchApi';
import { env, settings } from './settings';
import { userRepository } from './repository/userRespository';
import koaBody from 'koa-body';
import { UserConfig } from '@elpatobot/entity';

const cache = new InMemoryCache();
const app = new Koa();
const connections: Record<string, Array<ws.WebSocket>> = {};

app.use(cors({
    origin: settings.corsDomain,
}));

app.use(koaBody({ jsonLimit: '1kb' }));

const parseWebsocketMessage = (message: ws.MessageEvent) => {
    if (typeof message.data === 'string') return message.data;
    if (typeof message.data === 'object') {
        return new TextDecoder().decode(message.data as ArrayBuffer);
    }
};
const server = http.createServer(app.callback());
const wss = new ws.Server({ server });

const onQuack:TwitchClient['_onQuackCallback'] = (userId, channel) => {
    cache.addOneQuack(userId, channel);
    const channelWithoutHash = channel.replace('#', '');
    for (const connection of connections[channelWithoutHash] ?? []) {
        connection.send(JSON.stringify({
            type: 'quack',
            content: null
        } satisfies QuackEvent));
    }
};

const getQuackRank = async ():Promise<string> => {
    const users = await twitchApi.getUserProfileById(cache.topUsers.map((u) => u.userId));
    const usersQuacks = cache.topUsers.map((user) => {
        const twitchUser = users.find(u => u.id === user.userId);
        if (!twitchUser) return;

        return {
            name: twitchUser.displayName,
            quacks: user.quackCount,
        };
    });

    let msg = 'Quack Rank:';
    msg = usersQuacks
        .filter(u => u !== undefined)
        .sort((a,b) => b!.quacks - a!.quacks)
        .slice(0, 5)
        .map((u) => `  🦆 ${u?.name} ha quackeado ${u?.quacks} `).join('');
    return msg;

};

const twitchClient = new TwitchClient(onQuack, getQuackRank);

wss.on('connection', (socket) => {
    console.log('Someone connected');

    socket.onmessage = (msg) => {
        const msgParsed = parseWebsocketMessage(msg); 
        if (!msgParsed) return;
        const event = (JSON.parse(msgParsed) as BaseEvent);
        if (event.type === 'connect') {
            const { content } = (event as ConnectEvent);
            if (!content) return;
            const client = connections[content.channel];
            if (!client) {
                connections[content.channel] = [socket];
            } else if (!client.find((clientConnection) => clientConnection === socket)) {
                client.push(socket);
            }
            twitchClient.join(content.channel);
        }
    };

    socket.on('close', async function() {
        console.log('Someone disconnected');
        for (const key of Object.keys(connections)) {
            const sockets = connections[key];
            connections[key] = sockets.filter(soc => soc !== socket);
            if (connections[key].length === 0) {
                setTimeout(() => {
                    if (connections[key]?.length !== 0) return;
                    delete connections[key];
                    console.log(`All connections for channel ${key} disconnected`);
                    twitchClient.part(key);
                }, 60 * 1000);
            }
        }
    });
});

const appRouter = new Router();

appRouter.use('/', async (ctx, next) => {
    console.log(`[ ${ctx.method} ] - ${ctx.url}`);
    await next();
});

appRouter.get('/users/quacks', async (ctx) => {
    try {
        if (cache.topUsers.length === 0) {
            ctx.response.body = [];
            return;
        }
        const users = await twitchApi.getUserProfileById(cache.topUsers.map((u) => u.userId));
        const respBody:Array<UserQuacksResponse | undefined>  = cache.topUsers.map((user) => {
            const twitchUser = users.find(u => u.id === user.userId);
            if (!twitchUser) return;

            return {
                name: twitchUser.displayName,
                quacks: user.quackCount,
                profileImg: twitchUser.profilePictureUrl,
            } as UserQuacksResponse;
        });
        ctx.response.body = respBody.filter((i) => i !== undefined);
    } catch (e){
        console.log(e);
        console.log('Error from user api : ', (e as any).data);
    }
});

appRouter.get('/channels/quacks', async (ctx) => {
    try {
        if (cache.topChannels.length === 0) {
            ctx.response.body = [];
            return;
        }
        const channels = await twitchApi.getUserProfileByName(cache.topChannels.map((u) => u.userId));
        const respBody:Array<ChannelQuacksResponse | undefined>  = cache.topChannels.map((channel) => {
            const twitchUser = channels.find(u => u.name === channel.userId.replace('#', ''));
            if (!twitchUser) return;

            return {
                name: twitchUser.displayName,
                quacks: channel.quackCount,
                profileImg: twitchUser.profilePictureUrl,
                description: twitchUser.description,
            } as ChannelQuacksResponse;
        });
        ctx.response.body = respBody.filter((i) => i !== undefined); 
    } catch (e) {
        console.log('Error from channel api : ', e);
    }
});

appRouter.get('/user/config', async (ctx) => {
    const token = ctx.request.headers.authorization;
    if (typeof token !== 'string') throw new Error('token not found');
    const { login } = await twitchApi.validateToken(token);
    const config = await userRepository.getUserConfig(login);
    ctx.response.body = config;
});

appRouter.post('/user/config', async (ctx) => {
    const token = ctx.request.headers.authorization;
    if (typeof token !== 'string') throw new Error();
    const { login } = await twitchApi.validateToken(token);
    const body = ctx.request.body;
    if (typeof body !== 'object' || body === null) throw new Error('missing body');

    const {
        appearOnTheRanking,
        quackLimiterAmount,
        quackLimiterEnabled,
    } = (body as {
        appearOnTheRanking: unknown,
        quackLimiterAmount: unknown,
        quackLimiterEnabled: unknown
    });

    if (
        !(typeof appearOnTheRanking === 'boolean' &&
        typeof quackLimiterAmount === 'number' &&
        typeof quackLimiterEnabled === 'boolean')
    ) {
        ctx.res.statusCode = 400;
        return;
    }

    await userRepository.updateUserConfig({
        appearOnTheRanking,
        quackLimiterAmount,
        quackLimiterEnabled,
        userId: login
    });
    await twitchClient.updateConfigCache(login);

    ctx.res.statusCode = 200;
});

app.use(appRouter.routes());

server.on('listening', () => {
    console.log(`Started listening on http://localhost:${settings.port} for ${env} environment`);
});

server.listen(settings.port);
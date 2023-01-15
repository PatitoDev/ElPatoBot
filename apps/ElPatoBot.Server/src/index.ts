import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import http from 'http';
import { BaseEvent, ConnectEvent } from 'patoevents';
import ws from 'ws';
import TwitchClient from './twitchClient';
import { ChannelQuacksResponse, UserQuacksResponse } from 'responses';
import InMemoryCache from './InMemoryCache';
import twitchApi from './twitchApi';
import { env, settings } from './settings';

const cache = new InMemoryCache();
const app = new Koa();
const clients: Record<string, TwitchClient> = {};

app.use(cors({
    origin: settings.corsDomain,
}));

const parseWebsocketMessage = (message: ws.MessageEvent) => {
    if (typeof message.data === 'string') return message.data;
    if (typeof message.data === 'object') {
        return new TextDecoder().decode(message.data as ArrayBuffer);
    }
}
const server = http.createServer(app.callback());
const wss = new ws.Server({ server });

wss.on('connection', (socket) => {
    console.log('Someone connected');

    socket.onmessage = (msg) => {
        const msgParsed = parseWebsocketMessage(msg); 
        if (!msgParsed) return;
        const event = (JSON.parse(msgParsed) as BaseEvent);
        if (event.type === 'connect') {
            const { content } = (event as ConnectEvent);
            if (!content) return;
            console.log(`Client requested connection to channel ${content.channel}`);
            let client = clients[content.channel];
            if (!client) {
                client = new TwitchClient(content.channel, cache);
            }
            client.addToClient(socket);
            clients[content.channel] = client;
        }
    };

    socket.on('close', async function() {
        console.log('Someone disconnected');
        for (const key of Object.keys(clients)) {
            const client = clients[key];
            client.removeFromClient(socket);
            if (client.getConnections().length === 0 ) {
                console.log(`All connections for channel ${client.channel} disconnected`);
                //await client.killTwitchConnection();
                //delete clients[key];
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
        if (!users.data) {
            console.log('twitch returned weird data for users:');
            console.log(users);
            return;
        }
        const respBody:Array<UserQuacksResponse | undefined>  = cache.topUsers.map((user) => {
            const twitchUser = users.data.find(u => u.id === user.userId);
            if (!twitchUser) return;

            return {
                name: twitchUser.display_name,
                quacks: user.quackCount,
                profileImg: twitchUser.profile_image_url,
            } as UserQuacksResponse
        });
        ctx.response.body = respBody.filter((i) => i !== undefined);
    } catch (e){
        console.log(e);
        console.log('Error from user api : ', (e as any).data);
    }
})

appRouter.get('/channels/quacks', async (ctx) => {
    try {
        if (cache.topChannels.length === 0) {
            ctx.response.body = [];
            return;
        }
        const channels = await twitchApi.getUserProfileByName(cache.topChannels.map((u) => u.userId));
        if (!channels.data) {
            console.log('twitch returned weird data for channels:', channels);
            return;
        }
        const respBody:Array<ChannelQuacksResponse | undefined>  = cache.topChannels.map((channel) => {
            const twitchUser = channels.data.find(u => u.login === channel.userId.replace('#', ''));
            if (!twitchUser) return;

            return {
                name: twitchUser.display_name,
                quacks: channel.quackCount,
                profileImg: twitchUser.profile_image_url,
                description: twitchUser.description,
            } as ChannelQuacksResponse
        });
        ctx.response.body = respBody.filter((i) => i !== undefined); 
    } catch (e) {
        console.log('Error from channel api : ', e);
    }
})


app.use(appRouter.routes());

server.on('listening', () => {
    console.log(`Started listening on http://localhost:${settings.port} for ${env} environment`);
});

server.listen(settings.port);
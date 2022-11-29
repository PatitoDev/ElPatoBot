import { QuackEvent } from 'patoevents';
import SECRETS from 'secrets';
import tmi from 'tmi.js';  
import ws from 'ws';
import InMemoryCache from '../InMemoryCache';
import twitchApi from '../twitchApi';

class TwitchClient {
    channel: string;
    clientConnections: Array<ws.WebSocket>;
    twitchClient: tmi.Client;
    cache: InMemoryCache;

    constructor(channel:string, cache: InMemoryCache) {
        this.channel = channel;
        this.clientConnections = []
        this.cache = cache;
        this.twitchClient = new tmi.Client({
            options: { debug: false },
            identity: {
                username: SECRETS.twitch.username,
                password: `oauth:${SECRETS.twitch.token}`,
            },
            channels: [ channel ],
        });

        this.twitchClient.connect().catch(console.error);

        this.twitchClient.on('message', async (channel, tags, message, self) => {
            if (message.toLowerCase().trim() === "!quackrank") {
                try {
                    const users = await twitchApi.getUserProfileById(cache.topUsers.map((u) => u.userId));
                    const usersQuacks = cache.topUsers.map((user) => {
                        const twitchUser = users.data.find(u => u.id === user.userId);
                        if (!twitchUser) return;

                        return {
                            name: twitchUser.display_name,
                            quacks: user.quackCount,
                        }
                    });

                    let msg = 'Quack Rank:'
                    msg = usersQuacks
                        .filter(u => u !== undefined)
                        .sort((a,b) => b!.quacks - a!.quacks)
                        .slice(0, 5)
                        .map((u) => `  🦆 ${u?.name} a quackeado ${u?.quacks} `).join('');
                    await this.twitchClient.say(channel, msg);
                } catch (e) {
                    console.log('Error when receiving quackrank command: ', e);
                }
                return;
            }
            

            if (message.toLowerCase().trim().includes('*quack*')){
                try {
                    if (tags['user-id']) {
                        cache.addOneQuack(tags['user-id'], channel);
                    } else {
                        console.log('could not find user-id');
                    }

                    this.clientConnections.forEach((c) => {
                        if (
                            c.readyState === c.CLOSED ||
                            c.readyState === c.CLOSING) {
                                this.removeFromClient(c);
                                return;
                        }
                        c.send(JSON.stringify({
                            type: 'quack',
                        } as QuackEvent))
                    });
                } catch (e) {
                    console.log('Error when receiving *quack*:', e);
                }
            }
        });
    }

    public addToClient = (client:ws.WebSocket) => {
        this.clientConnections.push(client);
    }

    public removeFromClient = (client: ws.WebSocket) => {
        this.clientConnections = this.clientConnections
            .filter((c) => ( c !== client ));
    }
}

export default TwitchClient;
import { QuackEvent } from 'patoevents';
import SECRETS from 'secrets';
import tmi from 'tmi.js';  
import ws from 'ws';
import InMemoryCache from '../InMemoryCache';
import quackRepository from '../repository/quackRepository';

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
            options: { debug: true },
            identity: {
                username: SECRETS.twitch.username,
                password: `oauth:${SECRETS.twitch.token}`,
            },
            channels: [ channel ],
        });

        this.twitchClient.connect().catch(console.error);

        this.twitchClient.on('message', async (channel, tags, message, self) => {
            if (message.toLowerCase().trim() === "!q") {
                this.twitchClient.say(channel, '*quack*');
                return;
            }

            if (message.toLowerCase().trim() === "!quackRank") {
                let msg = 'Quack Rank:'
                msg = cache.topUsers.map((u) => ` ${u.userId} a quackeado ${u.quackCount} `).join('');
                this.twitchClient.say(channel, msg);
                return;
            }
            

            if (message.toLowerCase().trim().includes('*quack*')){
                if (tags['user-id']) {
                    console.log(`quack for user ${tags['user-id']}`);
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
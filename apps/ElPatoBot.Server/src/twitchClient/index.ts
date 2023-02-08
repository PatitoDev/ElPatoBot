import { QuackEvent } from 'patoevents';
import SECRETS from 'secrets';
import tmi from 'tmi.js';  
import ws from 'ws';
import InMemoryCache from '../InMemoryCache';
import QuackRestrictor from '../quackRestrictor';
import { env, settings } from '../settings';
import twitchApi from '../twitchApi';

class TwitchClient {
    public channel: string;
    private clientConnections: Array<ws.WebSocket>;
    private twitchClient: tmi.Client;
    private cache: InMemoryCache;
    private quackRestrictor: QuackRestrictor;

    constructor(channel:string, cache: InMemoryCache) {
        this.quackRestrictor = new QuackRestrictor();
        this.channel = channel;
        this.clientConnections = []
        this.cache = cache;
        this.twitchClient = new tmi.Client({
            options: { debug: env === 'dev' },
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
                    const users = await twitchApi.getUserProfileById(this.cache.topUsers.map((u) => u.userId));
                    const usersQuacks = this.cache.topUsers.map((user) => {
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
                        .map((u) => `  🦆 ${u?.name} ha quackeado ${u?.quacks} `).join('');
                    await this.twitchClient.say(channel, msg);
                } catch (e) {
                    console.log('Error when receiving quackrank command: ', e);
                }
                return;
            }
            
            if (message.toLowerCase().trim().includes('*quack*')){
                try {
                    const userId = tags['user-id'];
                    if (!userId) {
                        console.log('user id not found in tags. Aborting...');
                        return;
                    }

                    const allowed = await this.quackRestrictor.isQuackAllowed(userId, async () => {
                        await this.twitchClient.say(channel, `tranquilo @${tags['username']}! estas quackeando muy rapido, limita tus quacks a un quack cada ${settings.delayBetweenUserQuacksInSeconds} segundos`);
                    });

                    if (!allowed) return;

                    this.cache.addOneQuack(userId, channel);

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

    public killTwitchConnection = async () => (
        await this.twitchClient.disconnect()
    );

    public addToClient = (client:ws.WebSocket) => {
        this.clientConnections.push(client);
    }

    public getConnections = () => (
        this.clientConnections
    )

    public removeFromClient = (client: ws.WebSocket) => {
        this.clientConnections = this.clientConnections
            .filter((c) => ( c !== client ));
    }
}

export default TwitchClient;
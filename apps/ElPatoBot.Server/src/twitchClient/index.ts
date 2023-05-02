import SECRETS, { TokenCache } from '@elpatobot/secrets';
import QuackRestrictor from '../quackRestrictor';
import { ChatClient } from '@twurple/chat';
import { RefreshingAuthProvider } from '@twurple/auth';
import { UserConfig } from '@elpatobot/entity';
import { userRepository } from '../repository/userRespository';

interface TwitchPrivateMessage {
    id: string
    userInfo: {
        userId: string
    }
}

class TwitchClient {
    private _twitchClient: ChatClient;
    private _quackRestrictor: QuackRestrictor;
    private _tokenCache: TokenCache;
    private _onQuackCallback: (userId: string, channel: string) => void;
    private _getQuackRank: () => Promise<string>;
    private _authProvider: RefreshingAuthProvider;
    private _configCache: Record<string, UserConfig>;

    constructor(onQuack: TwitchClient['_onQuackCallback'], getQuackRank: TwitchClient['_getQuackRank']) {
        this._configCache = {};
        this._getQuackRank = getQuackRank;
        this._onQuackCallback = onQuack;
        this._quackRestrictor = new QuackRestrictor();
        this._tokenCache = new TokenCache(SECRETS.twitch.token, SECRETS.twitch.refreshToken);
        this._authProvider = new RefreshingAuthProvider({
            clientId: SECRETS.twitch.clientId,
            clientSecret: SECRETS.twitch.extensionSecret,
            onRefresh: (_, newToken) => {
                this._tokenCache.writeToken({
                    accessToken: newToken.accessToken,
                    expiresIn: newToken.expiresIn ?? 0,
                    obtainedAt: newToken.obtainmentTimestamp,
                    refreshToken: newToken.refreshToken,
                });
            }
        });

        // non awaited promise
        this._authProvider.addUserForToken({
            expiresIn: this._tokenCache.current.expiresIn,
            obtainmentTimestamp: this._tokenCache.current.obtainedAt,
            refreshToken: this._tokenCache.current.refreshToken,
            accessToken: this._tokenCache.current.accessToken,
            scope: ['chat:read', 'chat:edit'],
        }, ['chat']).then(() => {
            this._twitchClient.connect();
        });
        this._twitchClient = new ChatClient({ authProvider: this._authProvider });
        this._twitchClient.onAuthenticationFailure(() => {
            console.error('unable to authenticate with twitch chat');
        });
        this._twitchClient.onJoinFailure((chat, reason) => {
            console.error(`Unable to join channel:${chat} reason: ${reason}`);
        });
        this._twitchClient.onDisconnect((manually) => {
            if (manually) {
                console.log(`left channel, connections: ${this._twitchClient.currentChannels}`);
            }
        });
        this._twitchClient.onMessage(this.onMessage);
        this._twitchClient.onJoinFailure(console.error);
    }

    public updateConfigCache = async (channel: string) => {
        if (!this._configCache[channel]) return;
        const config = await userRepository.getUserConfig(channel);
        this._configCache[channel] = config;
    };

    public join = async (channel: string) => {
        console.log(`Attempting to join channel ${channel}`);
        this._twitchClient.join(channel);
        if (this._configCache[channel]) return;
        const config = await userRepository.getUserConfig(channel);
        this._configCache[channel] = config;
    };

    private onQuackRank = async (channel: string) => {
        this._twitchClient.say(channel, await this._getQuackRank());
    };

    private onQuack = async (channel: string, user: string, msgData: TwitchPrivateMessage) => {
        const userId = msgData.userInfo.userId;
        const channelWithoutHash = channel.replace('#', '');

        let config = this._configCache[channelWithoutHash];
        if (!config) {
            config = await userRepository.getUserConfig(channelWithoutHash);
        }

        if (config.quackLimiterEnabled) {
            const warningCount = this._quackRestrictor.getWarnings(userId, channel, config);
            if (warningCount === 1) {
                await this._twitchClient.say(channel, `tranquilo @${user}! estas quackeando muy rapido, limita tus quacks a un quack cada ${config.quackLimiterAmount} segundos`);
            }

            if (warningCount > 0) return;
        }

        this._onQuackCallback(userId, channel);
    };

    private onMessage = async (channel: string, user: string, message: string, msgData: TwitchPrivateMessage) => {
        if (message.toLowerCase().trim() === '!quackrank') {
            await this.onQuackRank(channel);
        }

        if (message
            .toLowerCase()
            .trim()
            .replace(' ', '')
            .includes('*quack*')){
            await this.onQuack(channel, user, msgData);
        }
    };

    public getConnections = () => this._twitchClient.currentChannels;

    public part = (channel: string) => {
        console.log(`Disconnecting from channel: ${channel}`);
        this._twitchClient.part(channel);
    };
}

export default TwitchClient;
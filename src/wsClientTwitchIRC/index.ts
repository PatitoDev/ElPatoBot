import { parseMessage } from './ircParser';

const reconnectionDelay = 5000;

export class TwitchClient {
    onMessageCallback: ((message:string) => void);
    userName: undefined | string;
    client: WebSocket;

    constructor(userName:string, onMessage: ((message:string) => void)){
        console.log('constructor called');
        this.onMessageCallback = onMessage;
        this.userName = userName;
        this.client = this.createWsClient();
    }
    
    closeConnection = () => {
        this.client.onclose = null;
        this.client.close();
    }
    
    private createWsClient = () => {
        const client = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
        client.onopen = this.onOpen;
        client.onclose = this.onClose;
        client.onmessage = this.handleMessage;
        client.onerror = this.onError;
        return client;
    }
    
    private onOpen = () => {
        this.initTwitchAuth();
    }

    private onClose = () => {
        console.error('Connection to twitch irc has been lost, reconnecting...');
        setTimeout(() => {
            this.client = this.createWsClient();
        }, reconnectionDelay);
    }
    
    private onError = () => {
        console.error('Error connecting to twitch ws');
        setTimeout(() => {
            this.client = this.createWsClient();
        }, reconnectionDelay);
    }

    private initTwitchAuth = () => {
        // TODO - anon auth
        this.client.send(`CAP REQ :twitch.tv/tags`);
        this.client.send('PASS asdasd');
        this.client.send(`NICK justinfan9999 `);
        this.client.send(`JOIN #${this.userName}`);
    }

    onPing = (twitchClient: WebSocket) => {
        twitchClient.send("PONG");
    }

    handleMessage = (message: MessageEvent) =>  {
        const parsedMessage = this.parseWebsocketMessage(message);
        if (!parsedMessage) { return }

        const messages = parsedMessage.split('\r\n');
        messages.forEach((message) => {
            if (!message) return;
            const parsedMessage = parseMessage(message);
            if (!parsedMessage) return;
            switch (parsedMessage.ircCommand) {
                case 'PING':
                    this.client.send('PONG')
                    break;
                case 'PRIVMSG':
                    if (!parsedMessage.body) return;
                    this.onMessageCallback(parsedMessage.body);
                    break;
            }
        });
    };

    parseWebsocketMessage = (message: MessageEvent) => {
        if (typeof message.data === 'string') return message.data;
        if (typeof message.data === 'object') {
            return new TextDecoder().decode(message.data as ArrayBuffer);
        }
    }
}

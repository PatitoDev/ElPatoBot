import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BaseEvent, ConnectEvent } from 'patoEvents';

const parseWebsocketMessage = (message: MessageEvent) => {
    if (typeof message.data === 'string') return message.data;
    if (typeof message.data === 'object') {
        return new TextDecoder().decode(message.data as ArrayBuffer);
    }
}

const BotPage = () => {
    const { userName } = useParams<{userName: string}>();
    const [wsClient, setWsClient] = useState<WebSocket>(new WebSocket('ws://localhost:8084'));

    useEffect(() => {
        wsClient.onopen = () => {
            if (!userName) return;

            wsClient.send(JSON.stringify({
                type: 'connect',
                content: {
                    channel: userName,
                }
            } as ConnectEvent));
        }
        wsClient.onmessage = (e) => {
            const resp = parseWebsocketMessage(e);
            if (!resp) return;
            const msg = JSON.parse(resp) as BaseEvent;
            if (msg.type === 'quack'){
                const audio = new Audio('/audio/quack-1.wav');
                audio.loop = false;
                audio.play(); 
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wsClient]);

    return <></>
}

export default BotPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tmi from 'tmi.js';

const BotPage = () => {
    const [tmiClient, setTmiClient] = useState<tmi.Client | null>(null);
    const { userName } = useParams<{userName: string}>();

    useEffect(() => {
        if (tmiClient || !userName) return;
        
        const client = new tmi.Client({
            options: { debug: true },
            identity: {
                username: 'justinfan9999',
                password: 'l1231l3l12jl3',
            },
            channels: [userName]
        });

        client.connect().catch(console.error);
        client.on('message', (channel, tags, message, self) => {
            if (message === '*quack*'){
                console.log('RECEIVED QUACK');
                var audio = new Audio('/audio/quack-1.wav');
                audio.loop = false;
                audio.play(); 
            }
        });
        setTmiClient(client);
        console.log('called create client');

        return () => {
            console.log('disconnecting');
            client.removeAllListeners();
            client.disconnect();
        }
    }, [userName]);

    return null;
}

export default BotPage;
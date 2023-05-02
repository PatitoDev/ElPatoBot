const env = process.env['NODE_ENV'] === 'production' ? 'prd' : 'dev';

if (env === 'dev') {
    console.log(`Using env ${env}`);
}

const allSettings:Record<'prd' | 'dev', {
    serverUrl: string,
    websocketUrl: string,
    loginUrl: string
}> = {
    dev: {
        serverUrl: 'http://localhost:8084/',
        websocketUrl: 'ws://localhost:8084/',
        loginUrl: 'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=u4i00xkzdt2e5ti2c10p396uqlkkvw&redirect_uri=http://localhost:3000&scope=&state=c3ab8aa609ea11e793ae92361f002671'
    },
    prd: {
        serverUrl: 'https://api.niv3kelpato.com/',
        websocketUrl: 'wss://api.niv3kelpato.com/',
        loginUrl: 'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=u4i00xkzdt2e5ti2c10p396uqlkkvw&redirect_uri=https://elpatobot.com&scope=&state=c3ab8aa609ea11e793ae92361f002671',
    }
};

export default allSettings[env];


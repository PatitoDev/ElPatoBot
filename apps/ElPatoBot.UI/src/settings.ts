const env = process.env['NODE_ENV'] === "production" ? "prd" : "dev";

if (env === 'dev') {
    console.log(`Using env ${env}`);
}

const allSettings:Record<"prd" | "dev", {
    serverUrl: string,
    websocketUrl: string
}> = {
    dev: {
        serverUrl: `http://localhost:8084/`,
        websocketUrl: `ws://localhost:8084/`
    },
    prd: {
        serverUrl: `https://api.elpatobot.com/`,
        websocketUrl: `wss://api.elpatobot.com/`
    }
}

export default allSettings[env];


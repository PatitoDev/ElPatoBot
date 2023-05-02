import SECRETS from '@elpatobot/secrets';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';

const createClient = () => {
    const auth = new AppTokenAuthProvider(SECRETS.twitch.clientId, 
        SECRETS.twitch.extensionSecret);
    return new ApiClient({
        authProvider: auth
    });
};

const getUserProfileById = async (userId: Array<string>) => {
    const client = createClient();
    return await client.users.getUsersByIds(userId);
};

const getUserProfileByName = async (userNames: Array<string>) => {
    const client = createClient();
    return await client.users.getUsersByNames(userNames.map(name => name.replace('#', '')));
};

const validateToken = async (token: string) => {
    const headers = new Headers();
    headers.append('Authorization', `OAuth ${token}`);
    const resp = await fetch('https://id.twitch.tv/oauth2/validate', {
        headers
    });
    const values = await resp.json();
    const clientId = values['client_id'];
    const userId = values['user_id'];
    const login = values['login'];
    if (typeof clientId !== 'string' || typeof userId  !== 'string' || typeof login !== 'string') {
        throw new Error('Invalid token');
    }
    if (clientId !== SECRETS.twitch.clientId) {
        throw new Error('Incorrect token');
    }

    return {
        userId,
        clientId,
        login
    };
};

const twitchApi = {
    getUserProfileById,
    getUserProfileByName,
    validateToken
};

export default twitchApi;
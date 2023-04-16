import SECRETS from '@elpatobot/secrets';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';

const createClient = () => {
    const auth = new AppTokenAuthProvider(SECRETS.twitch.clientId, 
        SECRETS.twitch.extensionSecret);
    return new ApiClient({
        authProvider: auth
    });
}

const getUserProfileById = async (userId: Array<string>) => {
    const client = createClient();
    return await client.users.getUsersByIds(userId);
}

const getUserProfileByName = async (userNames: Array<string>) => {
    const client = createClient();
    return await client.users.getUsersByNames(userNames.map(name => name.replace('#', '')));
}

const twitchApi = {
    getUserProfileById,
    getUserProfileByName,
}

export default twitchApi;
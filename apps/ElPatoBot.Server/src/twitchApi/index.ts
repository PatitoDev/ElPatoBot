import axios from 'axios';
import SECRETS from 'secrets';

export interface TwitchUser {
    id: string,
    login: string,
    display_name: string,
    description: string,
    profile_image_url: string,
}

const getUserProfileById = async (userId: Array<string>) => {
    console.log(userId);
    const url =  'https://api.twitch.tv/helix/users?' + userId.map((id) => `id=${id}`).join('&');
    console.log(url);
    return axios.get<{data: Array<TwitchUser>}>(url, {
        headers: {
            'Client-Id': SECRETS.twitch.clientId,
            'Authorization': `Bearer ${SECRETS.twitch.token}`
        }
    });
}

const getUserProfileByName = async (userId: Array<string>) => {
    const url =  'https://api.twitch.tv/helix/users?' + userId.map((id) => `login=${id.replace('#', '')}`).join('&');
    console.log(url);
    return axios.get<{data: Array<TwitchUser>}>(url, {
        params: {
            login: userId
        },
        headers: {
            'Client-Id': SECRETS.twitch.clientId,
            'Authorization': `Bearer ${SECRETS.twitch.token}`
        }
    });
}

const twitchApi = {
    getUserProfileById,
    getUserProfileByName
}

export default twitchApi;
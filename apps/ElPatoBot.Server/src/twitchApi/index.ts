import fetch, { Headers } from 'node-fetch';
import SECRETS from 'secrets';

export interface TwitchUser {
    id: string,
    login: string,
    display_name: string,
    description: string,
    profile_image_url: string,
}

const getUserProfileById = async (userId: Array<string>) => {
    const url =  'https://api.twitch.tv/helix/users?' + userId
        .map((id) => `id=${id}`)
        .join('&');
    const headers = new Headers();
    headers.set('Client-Id', SECRETS.twitch.clientId);
    headers.set('Authorization', `Bearer ${SECRETS.twitch.token}`);
    const resp = await fetch(url, { headers });
    const data = await resp.json();
    return data as { data: Array<TwitchUser> };
}

const getUserProfileByName = async (userId: Array<string>) => {
    const url =  'https://api.twitch.tv/helix/users?' + userId
        .map((id) => `login=${id.replace('#', '')}`)
        .join('&');

    const headers = new Headers();
    headers.set('Client-Id', SECRETS.twitch.clientId);
    headers.set('Authorization', `Bearer ${SECRETS.twitch.token}`);
    const resp = await fetch(url, { headers });
    const data = await resp.json();
    return data as { data: Array<TwitchUser> };
}

const twitchApi = {
    getUserProfileById,
    getUserProfileByName
}

export default twitchApi;
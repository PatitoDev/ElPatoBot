export interface UserQuacksResponse {
    name: string,
    quacks: number,
    profileImg: string
}

export interface ChannelQuacksResponse {
    name: string,
    description: string,
    quacks: number,
    profileImg: string,
    channelUrl: string
}
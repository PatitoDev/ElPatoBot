// cada quack se guarda in memory
// cada 5m actualizar db
// si no esta en el cache leemos db
// si esta en cache, actualizar cache

import quackRepository, { QuackEntity } from "../repository/quackRepository";

const DB_UPDATE_SYNC = 10000;
const MAX_TOP_ITEMS = 10;

class InMemoryCache {
    private users: Record<string, number>;
    private channels: Record<string, number>;
    public topUsers: Array<QuackEntity>;
    public topChannels: Array<QuackEntity>;
    private topHasChanged: boolean;

    constructor() {
        this.users = {};
        this.channels = {};
        this.topChannels = [];
        this.topUsers = [];
        this.getTopFromDb();
        this.topHasChanged = false;
        setInterval(this.updateDatabase, DB_UPDATE_SYNC)
    }

    private getTopFromDb =  async () => {
        this.topChannels = [];
        const channelQuacks = await quackRepository.getTopChannelQuacks()
        for (const channel of channelQuacks){
            const quacks = await quackRepository.getQuacksForChannel(channel.userId);
            this.topChannels.push({
                quackCount: quacks,
                userId: channel.userId
            })
        }

        this.topUsers = [];
        const userQuacks = await quackRepository.getTopUserQuacks()
        for (const user of userQuacks){
            const quacks = await quackRepository.getQuacksForUser(user.userId);
            this.topUsers.push({
                quackCount: quacks,
                userId: user.userId
            })
        }
    }

    private updateDatabase = async () => {
        try {
            if (this.topHasChanged) {
                await quackRepository.updateTopChannelQuacks(this.topChannels
                    .sort((c) => c.quackCount)
                    .slice(0, MAX_TOP_ITEMS)
                    .map((c) => c.userId));
                await quackRepository.updateTopUserQuacks(this.topUsers
                    .sort(u => u.quackCount)
                    .slice(0, MAX_TOP_ITEMS)
                    .map((u) => u.userId));
                this.topHasChanged = false;
            }

            for (const key of Object.keys(this.users)){
                const quacks = this.users[key];
                await quackRepository.setUserQuacks(key, quacks);
                delete this.users[key];
            }

            for (const key of Object.keys(this.channels)){
                const quacks = this.channels[key];
                console.log(this.channels);
                console.log(key, quacks);
                await quackRepository.setChannelQuacks(key, quacks);
                delete this.channels[key];
            }
        } catch (e) {
            console.log('Error on interval:', e);
        }
    }

    private getUserQuacks = async (userId:string) => {
        const existingUserCacheItem = this.users[userId];
        if (existingUserCacheItem) return existingUserCacheItem;
        const quacksFromDb = await quackRepository.getQuacksForUser(userId);
        this.users[userId] = quacksFromDb;
        return quacksFromDb
    }

    private getChannelQuacks = async (userId:string) => {
        const existingChannelCacheItem = this.channels[userId];
        if (existingChannelCacheItem) return existingChannelCacheItem;
        const quacksFromDb = await quackRepository.getQuacksForChannel(userId);
        this.channels[userId] = quacksFromDb;
        return quacksFromDb
    }

    private updateInternalUserTopQuacks = async (userId:string, quackCount:number) => {
        // si existe lo actualizamos
        const existingInTop = this.topUsers.find((u) => u.userId === userId);
        if (existingInTop) {
            this.topUsers.forEach((u) => {
                if (u.userId === userId){
                    u.quackCount = quackCount
                }
            });
            this.topHasChanged = true;
            return;
        }

        // si es menos lo agregamos sin mas
        if (this.topUsers.length < MAX_TOP_ITEMS) {
            this.topUsers.push({ quackCount, userId });
            this.topHasChanged = true;
            return;
        }

        // reverse sort
        const sortedQuacks = this.topUsers
            .sort((a,b) => b.quackCount - a.quackCount);

        // if less than limit
        const lastItem = sortedQuacks[sortedQuacks.length - 1];
        if (quackCount > lastItem.quackCount) {
            this.topHasChanged = true;
            sortedQuacks.pop();
            sortedQuacks.push({ quackCount, userId });
            this.topUsers = sortedQuacks;
        }
    }

    private updateInternalChannelTopQuacks = async (userId:string, quackCount:number) => {
        // si existe lo actualizamos
        const existingInTop = this.topChannels.find((u) => u.userId === userId);
        if (existingInTop) {
            this.topChannels.forEach((u) => {
                if (u.userId === userId){
                    u.quackCount = quackCount
                }
            });
            this.topHasChanged = true;
            return;
        }

        // si es menos lo agregamos sin mas
        if (this.topChannels.length < (MAX_TOP_ITEMS - 1)) {
            this.topChannels.push({ quackCount, userId });
            this.topHasChanged = true;
            return;
        }

        // reverse sort
        const sortedQuacks = this.topChannels
            .sort((a,b) => b.quackCount - a.quackCount);

        // if less than limit
        const lastItem = sortedQuacks[sortedQuacks.length - 1];
        if (quackCount > lastItem.quackCount) {
            this.topChannels =  [...this.topChannels
                .filter(u => u.userId !== lastItem.userId), {
                    quackCount,
                    userId
                }];
            this.topHasChanged = true;
        }
    }

    public addOneQuack = async (userId:string, channel:string) => {
        this.users[userId] = await (this.getUserQuacks(userId)) + 1;
        this.channels[channel] = await (this.getChannelQuacks(channel)) + 1;
        this.updateInternalChannelTopQuacks(channel, this.channels[channel]);
        this.updateInternalUserTopQuacks(userId, this.users[userId]);
    }
}

export default InMemoryCache;
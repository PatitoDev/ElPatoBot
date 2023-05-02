import { UserConfig } from '@elpatobot/entity';
import dbClient, { Tables } from './dbClient';

const getUserConfig = async (userId:string) => {
    const result = await dbClient.get({
        TableName: Tables.UserConfig,
        Key: { userId }
    });
    if (result.Item) {
        return result.Item as UserConfig;
    }

    return {
        appearOnTheRanking: true,
        quackLimiterAmount: 5,
        quackLimiterEnabled: true,
        userId
    } satisfies UserConfig;
};

const updateUserConfig = async (userConfig: UserConfig) => {
    await dbClient.put({
        TableName: Tables.UserConfig,
        Item: userConfig
    });
};

export const userRepository = {
    getUserConfig,
    updateUserConfig
};
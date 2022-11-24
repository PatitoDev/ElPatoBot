import client, { TableKey, Tables } from "./dbClient";

export interface QuackEntity {
    userId: string,
    quackCount: number,
}

const getQuacksForUser = async (userId: string) => {
    const userQuacks = await client.get({
        TableName: Tables.UserQuacks,
        Key: {
            'userId': userId
        }
    });

    return (userQuacks.Item as QuackEntity)?.quackCount ?? 0;
}

const getQuacksForChannel = async (userId: string) => {
    const userQuacks = await client.get({
        TableName: Tables.ChannelQuacks,
        Key: {
            'userId': userId
        }
    });

    return (userQuacks.Item as QuackEntity)?.quackCount ?? 0;
}

const setUserQuacks = async (userId: string, quacks: number) => {
    await client.put({
        TableName: Tables.UserQuacks,
        Item: {
            'userId': userId, 
            'quackCount': quacks,
        },
    });
}

const setChannelQuacks = async (userId: string, quacks: number) => {
    await client.put({
        TableName: Tables.ChannelQuacks,
        Item: {
            'userId': userId, 
            'quackCount': quacks,
        },
    });
}

const updateUserQuacks = async (userId: string, quacksToAdd: number) => {
    const userQuacks = await client.get({
        TableName: Tables.UserQuacks,
        Key: {
            'userId': userId
        }
    });
    
    let newQuacks = quacksToAdd; 
    if (userQuacks.Item) {
        newQuacks += userQuacks.Item['quackCount'];
    }

    await client.put({
        TableName: Tables.UserQuacks,
        Item: {
            'userId': userId, 
            'quackCount': newQuacks,
        },
    });
}

const updateChannelQuacks = async (userId: string, quacksToAdd: number) => {
    const userQuacks = await client.get({
        TableName: Tables.ChannelQuacks,
        Key: {
            'userId': userId
        }
    });
    
    let newQuacks = quacksToAdd; 
    if (userQuacks.Item) {
        newQuacks += userQuacks.Item['quackCount'];
    }

    await client.put({
        TableName: Tables.ChannelQuacks,
        Item: {
            'userId': userId, 
            'quackCount': newQuacks,
        },
    });
}

const getTopChannelQuacks = async () => {
    return ((await client
        .scan({ TableName: Tables.TopChannelQuacks, })).Items ?? []) as Array<{
            userId: string
        }>;
}

const getTopUserQuacks = async () => {
    return ((await client
        .scan({ TableName: Tables.TopUserQuacks, })).Items ?? []) as Array<{
            userId: string
        }>;
}

const updateTopUserQuacks = async (topUserQuacks: Array<string>) => {
    updateTopTable(topUserQuacks, 'TopUserQuacks');
}

const updateTopChannelQuacks = async (topChannelQuacks: Array<string>) => {
    updateTopTable(topChannelQuacks, 'TopChannelQuacks');
}

const updateTopTable = async (userIds: Array<string>, tableKey: TableKey) => {
    const resp = await client.scan({
        TableName: Tables[tableKey],
    });

    const items = resp.Items as Array<{ userId: string }> | undefined;
    if (!items || items.length === 0) {
        for (const userId of userIds) {
            await client.put({
                TableName: Tables[tableKey],
                Item: {
                    'userId': userId
                }
            });
        }
        return;
    }
    
    const itemsToAdd = userIds
        .filter((user) => !(items.find((itemInDb) => itemInDb.userId === user))); 
    for (const userId of itemsToAdd) {
        await client.put({
            TableName: Tables[tableKey],
            Item: {
                'userId': userId
            }
        });
    }

    const itemsToRemove = items
        .filter((itemInDb) => !(userIds.find((user) => itemInDb.userId === user))); 
    for (const userId of itemsToRemove) {
        await client.delete({
            TableName: Tables[tableKey],
            Key: {
                'userId': userId
            }
        });
    }
}

const quackRepository = {
    updateChannelQuacks,
    updateUserQuacks,
    getQuacksForChannel,
    getQuacksForUser,
    updateTopChannelQuacks,
    updateTopUserQuacks,
    getTopChannelQuacks,
    getTopUserQuacks,
    setUserQuacks,
    setChannelQuacks
}

export default quackRepository;
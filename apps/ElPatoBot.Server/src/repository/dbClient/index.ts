import SECRETS from '@elpatobot/secrets';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const env = process.env['env'];

export type TableKey = 'UserQuacks'
| 'ChannelQuacks'
| 'TopUserQuacks'
| 'TopChannelQuacks'
| 'UserConfig'

export const Tables: Record<TableKey, string> = {
    UserQuacks: `ElPatoBot-Aws-${env}-UserQuacks`,
    ChannelQuacks: `ElPatoBot-Aws-${env}-ChannelQuacks`,
    TopUserQuacks: `ElPatoBot-Aws-${env}-TopUserQuacks`,
    TopChannelQuacks: `ElPatoBot-Aws-${env}-TopChannelQuacks`,
    UserConfig: `ElPatoBot-Aws-${env}-UserConfig`,
};

const region = 'eu-west-2';
const internalClient = new DynamoDBClient({ region, credentials: {
    accessKeyId: SECRETS.aws.key,
    secretAccessKey: SECRETS.aws.secretKey, 
} });

const marshallOptions = {
    convertEmptyValues: true, // false, by default.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const client = DynamoDBDocument.from(internalClient, { marshallOptions, unmarshallOptions });

export default client;

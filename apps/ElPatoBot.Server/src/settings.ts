export const env = process.env['env'] as 'dev' | 'prd';

const allSettings:Record<'dev' | 'prd', {
    port: number,
    corsDomain: string
}> = {
    dev: {
        port: 8084,
        corsDomain: '*'
    },
    prd: {
        port: 8084,
        corsDomain: 'ElPatoBot.com'
    }
}

export const settings = allSettings[env];
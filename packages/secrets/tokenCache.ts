import fs from 'fs';

const FILE_CACHE_PATH = '/elpatobot_token.json';

interface Token {
    accessToken: string,
    refreshToken: string | null,
    expiresIn: number,
    obtainedAt: number,
}

export class TokenCache {

    public current: Token; 

    constructor(initialToken?:string, initialRefreshToken?: string) {
        console.log('using initial token');
        this.current = {
            accessToken: initialToken ?? '',
            refreshToken: initialRefreshToken ?? '',
            expiresIn: 0,
            obtainedAt: 0
        }

        if (!fs.existsSync(FILE_CACHE_PATH)) return;
        console.log('using cached token');
        this.readToken();
    }

    public readToken() {
        const file = fs.readFileSync(FILE_CACHE_PATH, 'utf-8');
        this.current = JSON.parse(file);
        return this.current;
    }

    public writeToken(data: Token) {
        this.current = data;
        fs.writeFileSync(FILE_CACHE_PATH, JSON.stringify(this.current), 'utf-8');
    }
}
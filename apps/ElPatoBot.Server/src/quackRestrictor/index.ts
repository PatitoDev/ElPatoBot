import { UserConfig } from '@elpatobot/entity';

interface UserActivity {
    lastActivity: Date,
    timeoutId: NodeJS.Timeout,
    warnings: number
}

class QuackRestrictor {
    private _userActivityMap: Record<string, UserActivity>;

    constructor() {
        this._userActivityMap = {};
    }

    private createUserToChanelKey = (user:string, channel:string) => (`${user}:${channel}`);

    public getWarnings = (userId: string, channel:string, config: UserConfig) => {
        const key = this.createUserToChanelKey(userId, channel);
        const userActivity = this._userActivityMap[key];

        if (!userActivity) {
            this.updateActivity(key, config.quackLimiterAmount);
            return 0;
        }

        userActivity.warnings += 1;
        console.log(`quack not allowed for user ${userId} in channel ${channel} with ${userActivity.warnings} warnings`);
        return userActivity.warnings;
    };

    private updateActivity = (key: string, delay: number) => {
        const timeoutId = setTimeout(() => this.clearActivity(key), delay * 1000);

        this._userActivityMap[key] = {
            lastActivity: new Date(),
            timeoutId,
            warnings: 0,
        };
    };

    public clearActivity = (key:string) => {
        delete this._userActivityMap[key];
    };
}

export default QuackRestrictor;
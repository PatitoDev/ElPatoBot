import { settings } from "../settings";

interface UserActivity {
    lastActivity: Date,
    timeoutId: NodeJS.Timeout,
    warnings: number
}

const delayBetweenQuacks = settings.delayBetweenUserQuacksInSeconds * 1000;

class QuackRestrictor {
    private _userActivityMap: Record<string, UserActivity>;

    constructor() {
        this._userActivityMap = {};
    }

    public isQuackAllowed = async (userId: string, firstWarning: () => Promise<void>) => {
        const userActivity = this._userActivityMap[userId];

        if (!userActivity) {
            this.updateActivity(userId);
            return true;
        };

        if (userActivity.warnings === 0) {
            await firstWarning();
        }

        console.log(`quack not allowed for user ${userId} with ${userActivity.warnings} warnings`);
        userActivity.warnings += 1;
        return false;
    }

    private updateActivity = (userId: string) => {
        const timeoutId = setTimeout(() => this.clearActivity(userId), delayBetweenQuacks);

        this._userActivityMap[userId] = {
            lastActivity: new Date(),
            timeoutId,
            warnings: 0,
        }
    }

    public clearActivity = (userId:string) => {
        delete this._userActivityMap[userId]
    }
}

export default QuackRestrictor;
import { UserConfig } from '@elpatobot/entity';
import axios from 'axios';
import settings from '../../../settings';
import { useEffect, useState } from 'react';
import Typography from '../../atoms/Typography';
import * as S from './styles';

export interface UserConfigurationProps {
    token: string
}

const UserConfiguration = ({ token }: UserConfigurationProps) => {
    const [config, setConfig] = useState<UserConfig | null>(null);

    useEffect(() => {
        (async () => {
            const configResp = await axios.get<UserConfig>(settings.serverUrl + 'user/config', {
                headers: {
                    'Authorization': token
                }
            });
            setConfig(configResp.data);
        })();
    }, [token]);


    useEffect(() => {
        (async () => {
            if (config === null) return;
            await axios.post(settings.serverUrl + 'user/config', config, {
                headers: {
                    'Authorization': token
                }
            });
        })();
    }, [config]);

    const onAppearOnRankingChange = (value: boolean) => {
        setConfig((prev) => {
            if (!prev) return prev;
            return ({
                ...prev,
                appearOnTheRanking: value
            });
        });
    };

    const onLimiterChanged = (value: boolean) => {
        setConfig((prev) => {
            if (!prev) return prev;
            return ({
                ...prev,
                quackLimiterEnabled: value
            });
        });
    };

    const onQuackLimiterAmount = (value: string) => {
        setConfig((prev) => {
            if (!prev) return prev;
            const parsedValue = parseInt(value);
            if (isNaN(parsedValue)) return prev;
            return {
                ...prev,
                quackLimiterAmount: parsedValue
            };
        });
    };

    if (config) return (
        <S.Container>
            {/*
            <div> 
                <input id="showOnRankingCheckbox" checked={config.appearOnTheRanking} type="checkbox" onChange={() => {
                    onAppearOnRankingChange(!config.appearOnTheRanking);
                }} 
                />
                <label htmlFor='showOnRankingCheckbox'>
                    <Typography variant='description'>
                        Aparecer en el ranking de canales 
                    </Typography>
                </label>
            </div>
            */}
            <div> 
                <Typography variant='description'>
                    <input id="quackLimiterCheckbox" checked={config.quackLimiterEnabled} type="checkbox" onChange={() => {
                        onLimiterChanged(!config.quackLimiterEnabled);
                    }} />
                    <label htmlFor="quackLimiterCheckbox">
                        Limitar a 1 quack por
                        <input value={config.quackLimiterAmount} type="number" onChange={(e) => {
                            onQuackLimiterAmount(e.target.value);
                        }} />
                    segundos por usuario

                    </label>
                </Typography>
            </div>
        </S.Container>
    );

    return (
        <>Loading...</>
    );
};

export default UserConfiguration;
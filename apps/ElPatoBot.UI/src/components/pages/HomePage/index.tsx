import { useCallback, useEffect, useState } from 'react';
import Particles  from 'react-tsparticles';
import InputText from '../../atoms/InputText';
import Typography from '../../atoms/Typography';
import ClickToCopy from '../../molecules/ClickToCopy';
import Leaderboard from '../../organism/Leaderboard';
import type { Engine } from 'tsparticles-engine';
import * as S from './styles';
import { loadFull } from 'tsparticles';
import settings from '../../../settings';
import { particleOptions } from './particleOptions';
import UserConfiguration from '../../organism/UserConfiguration';

const HomePage = () => {
    const [userName, setUserName] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const onHashChange = () => {
            const keyValuePairs = location.hash.replace('#', '').split('&');
            for (const keyValuePair of keyValuePairs) {
                const [key, value] = keyValuePair.split('=');
                console.log(key, value);
                if (key === 'access_token' && value) {
                    setToken(value);
                    location.hash = '';
                    return;
                }
            }
        };
        onHashChange();
    }, []);



    const onLogOut = () => {
        setToken(null);
    };

    const particlesInit = useCallback(async (engine: Engine) => {
        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    return (
        <S.Page>
            <Particles 
                init={particlesInit}
                width="100%"
                height="100%"
                options={particleOptions}
            />

            <S.Card>
                <Typography variant="title">El Pato Bot</Typography>
                <div>
                    <div>
                        <Typography variant="body">
                        Sube el nivel de tu stream con el pato que hace&nbsp;
                        </Typography>
                        <Typography variant="body" color="orange">
                        *quack*
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="body">
                        con el commando&nbsp;
                        </Typography>       
                        <Typography variant="body" color="orange">
                        *quack*
                        </Typography>
                    </div>
                </div>

                <InputText
                    value={userName}
                    onChange={(e) => { setUserName(e.currentTarget.value); }}
                    placeholder="Nombre de twitch..." 
                />

                <S.CenterContainer>
                    <S.CenterContainer>
                        <ClickToCopy content={`${window.location.origin}/${userName}`} />
                        <Typography variant="description">
                        Copia este link on OBS para empezar a quackear.
                        </Typography>
                    </S.CenterContainer>

                    {!token ? (
                        <S.Anchor href={settings.loginUrl}>Login para configurar</S.Anchor>
                    ) : (
                        <>
                            <S.Button onClick={onLogOut}>Log out</S.Button>
                            <UserConfiguration token={token} />
                        </>
                    )}
                </S.CenterContainer>

                <Leaderboard />
            </S.Card>
        </S.Page>
    );
};

export default HomePage;
import { useCallback, useState } from "react";
import Particles  from "react-tsparticles";
import InputText from "../../atoms/InputText";
import Typography from "../../atoms/Typography";
import ClickToCopy from "../../molecules/ClickToCopy";
import Leaderboard from "../../organism/Leaderboard";
import type { Engine, ISourceOptions } from "tsparticles-engine";
import * as S from './styles';
import { loadFull } from "tsparticles";

const HomePage = () => {
    const [userName, setUserName] = useState<string>('');

    const options: ISourceOptions = {
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                background: {
                    color: {
                        value: "#FFCD6B",
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "attract",
                        },
                        resize: true,
                    },
                    modes: {
                        attract: {
                        },
                    },
                },
                particles: {
                    collisions: {
                        enable: true,
                    },
                    move: {
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 100,
                    },
                    shape: {
                        type: "image",
                        images: [{
                            src: '/img/DuckMouthOpen.png',

                        },{
                            src: '/img/DuckMouthClose.png',
                        }]
                    },
                    size: {
                        value: 20,
                    },
                },
                detectRetina: true,
    };

    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);

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
            options={options}
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
                onChange={(e) => { setUserName(e.currentTarget.value) }}
                placeholder="Nombre de twitch..." 
            />

            <div>
                <div>
                    <ClickToCopy content={`${window.location.origin}/${userName}`} />
                </div>
                <div>
                    <Typography variant="description">
                        Copia este link on OBS para empezar a quackear.
                    </Typography>
                </div>
            </div>
            <Leaderboard />
        </S.Card>
    </S.Page>
    );
}

export default HomePage;
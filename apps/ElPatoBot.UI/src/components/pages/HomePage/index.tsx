import { useState } from "react";
import InputText from "../../atoms/InputText";
import Typography from "../../atoms/Typography";
import ClickToCopy from "../../molecules/ClickToCopy";
import Leaderboard from "../../organism/Leaderboard";
import * as S from './styles';

const HomePage = () => {
    const [userName, setUserName] = useState<string>('');

    return (
    <S.Page>
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
import * as S from './styles';
import { faCamera, faExclamationTriangle, faSpider, faSpinner, faUser, faVideoCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChannelQuacksResponse, UserQuacksResponse } from 'responses';
import QuackCard from '../../molecules/QuackCard';
import Typography from '../../atoms/Typography';
import settings from '../../../settings';

interface State {
    userQuacks: Array<UserQuacksResponse> | null,
    channelQuacks: Array<ChannelQuacksResponse> | null,
    isLoading: boolean,
    error: boolean,
}

interface RankingType {
    id: number,
    icon: IconDefinition,
    name: string,
}

const rankingTypes: Array<RankingType> = [
    {
        id: 0,
        icon: faUser,
        name: 'Quacks Por Usuario',
    },
    {
        id: 1,
        icon: faVideoCamera,
        name: 'Quacks Por Canal',
    },
]
const Leaderboard = () => {
    const [{
        channelQuacks,
        error,
        isLoading,
        userQuacks
    }, setState] = useState<State>({
        isLoading: false,
        channelQuacks: null,
        error: false,
        userQuacks: null,
    });

    const [selectedRankType, setSelectedRankType] = useState<number>(0);

    useEffect(() => {
        (async () => {
            try {
                setState({
                    isLoading: true,
                    channelQuacks: null,
                    error: false,
                    userQuacks: null,
                });
                const userQuackResp = await axios.get(settings.serverUrl + 'users/quacks');
                const channelQuackResp = await axios.get(settings.serverUrl + 'channels/quacks');
                setState({
                    isLoading: false,
                    channelQuacks: channelQuackResp.data,
                    userQuacks: userQuackResp.data,
                    error: false,
                });
            } catch {
                setState({
                    isLoading: false,
                    channelQuacks: null,
                    userQuacks: null,
                    error: true,
                });
            }
        })();
    }, []);

    if (error) {
        return (
            <Typography variant="action">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                {' '}
                Ranking exploto! Demasiados *quack*s
            </Typography>
        )
    }

    if (isLoading) {
        return (
            <Typography variant="title">
                <FontAwesomeIcon icon={faSpinner} spin color="black" />
            </Typography>
        )
    }

    return (
        <S.Container>
            <S.RankTypesMenu>
                {rankingTypes.map((rankType) => (
                    <S.MenuButton 
                        isSelected={rankType.id === selectedRankType}
                        key={rankType.id} 
                        onClick={() => {
                            setSelectedRankType(rankType.id)
                        }}>
                        <FontAwesomeIcon icon={rankType.icon} />
                        {rankType.name}
                    </S.MenuButton>
                ))}
            </S.RankTypesMenu>

            {userQuacks && selectedRankType === 0 && userQuacks
            .sort((a, b) => b.quacks - a.quacks)
            .slice(0, 9)
            .map((user, index) => (
                <QuackCard
                    key={user.name}
                    name={user.name}
                    profileUrl={user.profileImg}
                    quacks={user.quacks}
                    rankPosition={index + 1}
                />
            ))}
        
            {channelQuacks && selectedRankType === 1 && channelQuacks
            .sort((a, b) => b.quacks - a.quacks)
            .slice(0, 9)
            .map((channel, index) => (
                <QuackCard
                    key={channel.name}
                    name={channel.name}
                    profileUrl={channel.profileImg}
                    quacks={channel.quacks}
                    rankPosition={index + 1}
                    description={channel.description}
                    url={`https://twitch.tv/${channel.name}`}
                />
            ))}
        </S.Container>
    )
}

export default Leaderboard;
import * as S from './styles';
import { faExclamationTriangle, faSpider, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChannelQuacksResponse, UserQuacksResponse } from 'responses';
import QuackCard from '../../molecules/QuackCard';
import Typography from '../../atoms/Typography';

const baseUrl = 'http://localhost:8084/'

interface State {
    userQuacks: Array<UserQuacksResponse> | null,
    channelQuacks: Array<ChannelQuacksResponse> | null,
    isLoading: boolean,
    error: boolean,
}

interface RankingType {
    id: number,
    name: string,
}

const rankingTypes = [
    {
        id: 0,
        name: 'Quacks Por Usuario',
    },
    {
        id: 1,
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
                const userQuackResp = await axios.get(baseUrl + 'users/quacks');
                const channelQuackResp = await axios.get(baseUrl + 'channels/quacks');
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
                        {rankType.name}
                    </S.MenuButton>
                ))}
            </S.RankTypesMenu>

            {userQuacks && selectedRankType === 0 && userQuacks
            .sort((a, b) => b.quacks - a.quacks)
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
            .map((channel, index) => (
                <QuackCard
                    key={channel.name}
                    name={channel.name}
                    profileUrl={channel.profileImg}
                    quacks={channel.quacks}
                    rankPosition={index + 1}
                    description={channel.description}
                />
            ))}
        </S.Container>
    )
}

export default Leaderboard;
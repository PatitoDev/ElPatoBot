/* eslint-disable @next/next/no-img-element */
import Typography from '../../atoms/Typography';
import * as S from './styles';

export interface QuackCardProps {
    rankPosition: number,
    profileUrl: string,
    name: string,
    description?: string,
    quacks: number
}

const QuackCard = ({
    name,
    profileUrl,
    quacks,
    rankPosition,
    description
}: QuackCardProps) => (
    <S.Card>
        <Typography color="white" variant='title'>
            {rankPosition}
        </Typography>
        <img src={profileUrl} alt={name} />
        <S.TitleContainer>
            <Typography color='white' variant='action'>
                {name}
            </Typography>
            {description && (
                <Typography color='white' variant='description'>
                    {description}
                </Typography>   
            )}
        </S.TitleContainer>
        <Typography color="white"variant='action'>
            {quacks}
            {' '}
            Quacks
        </Typography>
    </S.Card>
)

export default QuackCard;
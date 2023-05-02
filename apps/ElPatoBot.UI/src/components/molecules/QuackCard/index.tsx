import Link from '../../atoms/Link';
import Typography from '../../atoms/Typography';
import * as S from './styles';

export interface QuackCardProps {
    rankPosition: number,
    profileUrl: string,
    name: string,
    description?: string,
    quacks: number,
    url?: string,
}

const QuackCard = ({
    name,
    profileUrl,
    quacks,
    rankPosition,
    description,
    url
}: QuackCardProps) => (
    <S.Card rankPos={rankPosition}>
        <Typography color="white" variant='title'>
            {rankPosition}
        </Typography>
        <img src={profileUrl} alt={name} />
        <S.TitleContainer>
            { url ?
                <Link href={url} target="_blank">
                    <Typography color='white' variant='action'>
                        {name}
                    </Typography>
                </Link>
                :
                <Typography color='white' variant='action'>
                    {name}
                </Typography>
            }
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
);

export default QuackCard;
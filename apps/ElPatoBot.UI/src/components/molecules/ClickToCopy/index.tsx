import { useEffect, useState } from 'react';
import Typography from '../../atoms/Typography';
import * as S from './style';

export interface ClickToCopyProps {
    content: string,
}

const ClickToCopy = ({ content }:ClickToCopyProps) => {
    const [isShowing, setIsShowing] = useState<boolean>(false);

    const onClick = () => {
        setIsShowing(true);
        setTimeout(() => {
            setIsShowing(false);
        }, 1000);
        navigator.clipboard.writeText(content);
    }
    
    return (
        <>
            {isShowing && (
                <S.NotificationContainer>
                    Copiado al clipboard
                </S.NotificationContainer>
            )}
            <S.Container
            type="button"
            onClick={onClick}>
                <img 
                    alt="click to copy"
                    width="30px" src="/img/copy.svg" 
                />
                <Typography variant='action'>
                    {content}
                </Typography>
            </S.Container>
        </>
    )
}

export default ClickToCopy;
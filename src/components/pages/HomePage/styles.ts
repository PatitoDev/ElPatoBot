import Styled from 'styled-components';

export const Page = Styled.div`
    // TODO img
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-image: url('/img/bg.png');
    background-position: center;
    background-size: contain;
`

export const Card = Styled.div`
    margin: 20px;
    word-break: break-word;
    text-align: center;
    padding: 2em 4em;
    border-radius: 1em;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: ${({theme}) => theme.colors.white};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    > *:not(:first-child) {
        margin: 2em 0;
    }
`;
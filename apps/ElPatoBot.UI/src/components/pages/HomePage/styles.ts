import Styled from 'styled-components';

export const Page = Styled.div`
    display: flex;
    justify-content: center;
    height: 100vh;
    overflow: auto;
    align-items: baseline;
`

export const Card = Styled.div`
    max-width: 800px;
    margin: 15em 20px 20px 20px;
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
    @media (max-width:515px) or (max-height: 500px) {
        max-height: 90%;
        max-width: 90%;
        overflow: auto;
        padding: 10px;
        font-size: 0.7rem;
        margin: 5px;
    }
`;
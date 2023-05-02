import Styled, { css } from 'styled-components';

export const Page = Styled.div`
    display: flex;
    justify-content: center;
    height: 100vh;
    overflow: auto;
    align-items: baseline;
`;

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

const sharedButtonStyles = css`
    margin-top: 2em;
    outline: solid 2px #f8d2ba;
    color: black;
    background: linear-gradient(89.76deg, #FFE5A0 0.14%, #FFC5A5 104.7%);
    padding: 0.7em 1em;
    border-radius: 3px;
    font-size: 1.3em;
    :hover {
        box-shadow: 0 0 4px 0px #8f7529;
    }
`;

export const Anchor = Styled.a`
    display: inline-block;
    text-decoration: none;
    ${sharedButtonStyles}
`;

export const Button = Styled.button`
    margin-bottom: 2em;
    cursor: pointer;
    border: none;
    ${sharedButtonStyles}
`;

export const CenterContainer = Styled.div`
    text-align: center;
    flex-direction: column;
    display: flex;
    align-items: center;
`;
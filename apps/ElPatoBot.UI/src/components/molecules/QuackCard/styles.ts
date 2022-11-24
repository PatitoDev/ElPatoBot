import styled from 'styled-components';

export const Card = styled.div`
    color: ${(prop) => prop.color};
    background-color: ${({theme}) => theme.colors.black };
    border-radius: 1em;
    padding: 1em;
    display: flex;
    align-items: center;
    text-align: left;
    > img {
        border-radius: 50%;
        margin-left: 1.5em;
        margin-right: 1em;
        width: 40px;
    }
    > :last-child {
        margin-left: auto;
    }
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-width: 60%;
    > * {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
import styled, { css } from 'styled-components';

export const Container = styled.div`
    width: 100%;
    > * {
        margin-bottom: 1em;
    }
`;

export const RankTypesMenu = styled.div`
    display: flex;
    width: 100%;
    > *:not(:last-child){
        margin-right: 0.8em;
    }
`

export const MenuButton = styled.button<{isSelected: boolean}>`

    ${({ isSelected }) => !isSelected && css`
        opacity: 0.5;
        :hover {
            color: ${({theme}) => theme.colors.orange};
            opacity: 0.8;
        }
    `}

    > *:first-child {
        margin-right: 0.2em;
    }

    color: ${({theme}) => theme.colors.black};
    font-weight: bold;
    border: none;
    background-color: initial;
    padding: 0;
    font-size: 1.2em;
    cursor: pointer;
`
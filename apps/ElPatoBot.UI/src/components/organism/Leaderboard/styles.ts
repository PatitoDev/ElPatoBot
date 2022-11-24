import styled from 'styled-components';

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
        margin-right: 0.5em;
    }
`

export const MenuButton = styled.button<{isSelected: boolean}>`
    font-weight: ${({isSelected}) => isSelected ? 'bold' : 'regular'};
    border: none;
    background-color: initial;
    padding: 0;
    font-size: 1.2em;
    cursor: pointer;
`
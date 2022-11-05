import Styled from 'styled-components';

export const Input = Styled.input`
    background-color: transparent;
    color: ${({theme}) => theme.colors.black};
    border: solid 3px ${({theme}) => theme.colors.black};
    padding: 1em 1.5em;
    border: none;
    font-size: 1.5em;
`;
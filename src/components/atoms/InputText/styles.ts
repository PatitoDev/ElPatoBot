import Styled from 'styled-components';

export const Input = Styled.input`
    background-color: ${({theme}) => theme.colors.lightGray};
    color: ${({theme}) => theme.colors.gray};
    padding: 1em 1.5em;
    border: none;
    font-size: 1.5em;
`;
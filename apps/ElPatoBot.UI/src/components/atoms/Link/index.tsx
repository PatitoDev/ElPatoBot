import styled, { css } from "styled-components";
import Typography from "../Typography";

const Link = styled.a`
    text-decoration: none;
    color: ${({theme}) => theme.colors.white};
    ${Typography} {
        color: ${({theme}) => theme.colors.white};
    }
    :hover {
        color: ${({theme}) => theme.colors.orange};
        ${Typography} {
        color: ${({theme}) => theme.colors.orange};
        }
    }
`;

export default Link;
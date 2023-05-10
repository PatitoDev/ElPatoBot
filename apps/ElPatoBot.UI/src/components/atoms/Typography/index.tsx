import styled, { css, DefaultTheme } from 'styled-components';

interface TypographyProps {
    noWrap?: boolean,
    variant?: 'title' | 'body' | 'action' | 'description',
    color?: keyof DefaultTheme['colors'],
}

const Typography = styled.span<TypographyProps>`
    color: ${({theme, color = 'black'}) => theme.colors[color]};

    ${({ noWrap }) => noWrap && css`
        white-space: nowrap; 
    `}

    ${({variant}) => variant === 'title' && css`
        font-weight: bold;
        font-size: 3em;
    `}

    ${({variant}) => variant === 'body' && css`
        font-size: 1.8em;
    `}

    ${({variant}) => variant === 'action' && css`
        font-weight: bold;
        font-size: 1.8em;
    `}

    ${({variant}) => variant === 'description' && css`
        font-size: 1.2em;
    `}
`;

export default Typography;
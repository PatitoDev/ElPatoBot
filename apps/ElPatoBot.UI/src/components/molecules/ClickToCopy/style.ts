import Styled, { keyframes } from 'styled-components';
import Typography from '../../atoms/Typography';

export const Container = Styled.button`
    cursor: pointer;
    border: none;
    background-color: unset;
    margin: 0;
    display: flex;
    align-items: center;
    > *:first-child {
        margin-right: 0.5em;
    }
    :hover {
        ${Typography} {
            color: ${({theme}) => theme.colors.orange};
        }
    }
`;

const slideIn = keyframes`
  from {
    transform: translateX(150%);
  }

  to {
    transform: translateX(0);
  }
`;
export const NotificationContainer = Styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #383838;
    color: white;
    padding: 0.5em 1em;
    border-radius: 8px;
    font-size: 1.2em;
    font-weight: bold;
    animation: 0.8s ${slideIn};
`;


import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
      gray: string;
      lightGray: string;
      orange: string;
      yellow: string;
    };
  }
}
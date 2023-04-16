import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App';
import './index.css';
import { theme } from './theme/theme';

const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
);

root.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
);
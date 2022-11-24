import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BotPage from '../components/pages/BotPage';
import HomePage from '../components/pages/HomePage';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:userName" element={<BotPage />} />
        </Routes>
    </BrowserRouter>
);

export default App;
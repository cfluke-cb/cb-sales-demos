import { Routes, Route, HashRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Layout } from './Layout';
import { Wallet } from './pages/Wallet';
import { Pay } from './pages/Pay';
import { Chat } from './pages/Chat';

export const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  </HashRouter>
);

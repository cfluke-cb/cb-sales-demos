import { Routes, Route, HashRouter } from 'react-router-dom';
import { Home } from './Home';
import { Layout } from './Layout';

export const Router = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  </HashRouter>
);

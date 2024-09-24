import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './HomePage';
import CharCreation from './CharCreation';
import Encounters from './Encounters';
import Inventory from './Inventory';
import Login from './Login';
import MapGen from './MapGen';
import Store from './Store';

const App: FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/char-creation">Character Creation</Link></li>
          <li><Link to="/encounters">Encounters</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/map-gen">Map Generator</Link></li>
          <li><Link to="/store">Store</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/char-creation" element={<CharCreation />} />
        <Route path="/encounters" element={<Encounters />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map-gen" element={<MapGen />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </Router>
  );
};

export default App;

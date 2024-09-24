import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const NavBar: FC = () => (
  <nav>
    <ul>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/char-creation">Character Creation</Link></li>
      <li><Link to="/encounters">Encounters</Link></li>
      <li><Link to="/inventory">Inventory</Link></li>
      <li><Link to="/map-gen">Map Generator</Link></li>
      <li><Link to="/store">Store</Link></li>
    </ul>
  </nav>
);

export default NavBar;

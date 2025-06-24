import React from 'react';
import { Link } from 'react-router-dom';
import './AppHeader.css';

const AppHeader: React.FC = () => (
  <div id="header-container">
    <div id="header">
      <div className="container">
        <h1>
          <Link to="/">FilmHose</Link>
        </h1>
        <h2>Listings for London's independent / arts cinemas</h2>
      </div>
    </div>
    <div className="container">
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/help">Help wanted</Link>
      </nav>
    </div>
  </div>
);

export default AppHeader;

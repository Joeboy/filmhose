import React from 'react';
import { Link } from 'react-router-dom';
import './AppHeader.css';

const AppHeader: React.FC = () => (
  <div id="header-container">
    <div id="header">
      <div className="container" style={{ paddingBottom: '0.5rem' }}>
        <img
          src="/logo.svg"
          alt="FilmHose masthead"
          style={{ margin: '0.25rem 1rem 0.25rem 0rem', float: 'left', height: '3.5rem' }}
        />
        <h1>
          <Link to="/">FilmHose</Link>
        </h1>
        <h2>Listings for London's independent / arts cinemas</h2>
      </div>
    </div>
    <div className="container">
      <nav>
        <Link to="/">Home</Link> | <Link to="/cinemas">Cinemas</Link> |{' '}
        <Link to="/about">About</Link> | <Link to="/help">Help wanted</Link>
      </nav>
    </div>
  </div>
);

export default AppHeader;

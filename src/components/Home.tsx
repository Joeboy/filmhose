import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';

const Home: React.FC = () => {
  usePageSEO();
  useStructuredData();

  return (
    <div>
      <div className="home-intro" style={{ marginBottom: '2rem' }}>
        <p>
          Welcome to <strong>FilmHose</strong> - your guide to London's
          independent and arts cinema scene. Discover showtimes for art house
          films, repertory screenings, and unique movie experiences across the
          capital's non-chain cinemas.
        </p>
      </div>

      <ul className="home-nav-list">
        <li>
          <Link to="/distilled">
            <strong>Distilled Listings</strong> - See showtimes by date,
            excluding films with lots of showings. Go here to find rarer
            opportunities to catch interesting films, without the clutter of
            mainstream releases
          </Link>
        </li>
        <li>
          <Link to="/hosepipe">
            <strong>Full Listings</strong> - Complete showtimes, including the
            current big releases
          </Link>
        </li>
        <li>
          <Link to="/titles">
            <strong>Search by Title</strong> - Find specific films and their
            showtimes across London
          </Link>
        </li>
        <li>
          <Link to="/cinemas">
            <strong>Cinema Directory</strong> - Explore the venues
          </Link>
        </li>
      </ul>

      <div
        className="home-features"
        style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}
      ></div>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';

const Home: React.FC = () => {
  usePageSEO();
  useStructuredData();

  return (
    <div>
      <ul className="home-nav-list">
        <li>
          <Link to="/listings">
            See listings by date, excluding films with lots of showings
          </Link>
        </li>
        <li>
          <Link to="/hosepipe">See all listings by date</Link>
        </li>
        <li>
          <Link to="/titles">Search for showtimes by film title</Link>
        </li>
        <li>
          <Link to="/cinemas">See cinema info</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;

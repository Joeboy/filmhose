import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
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

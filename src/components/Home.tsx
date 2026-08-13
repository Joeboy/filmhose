import React from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';

const Home: React.FC = () => {
  usePageSEO();
  useStructuredData();

  return (
    <div>
      <h1>Welcome to FilmHose</h1>
      <h2>Listings for London's independent and arts cinemas</h2>
      <p>
        Welcome to <strong>FilmHose</strong> - your guide to London's
        independent and arts cinema scene. Discover showtimes for art house
        films, repertory screenings, and unique movie experiences across the
        capital's non-chain cinemas.
      </p>

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
        <li>
          <Link to="/director/240">Films by Stanley Kubrick</Link>
        </li>
        <li>
          <Link to="/director/5602">Films by David Lynch</Link>
        </li>
        <li>
          <Link to="/director/8452">Films by Andrei Tarkovsky</Link>
        </li>
        <li>
          <Link to="/director/1032">Films by Martin Scorsese</Link>
        </li>
        <li>
          <Link to="/director/224">Films by David Cronenberg</Link>
        </li>
        <li>
          <Link to="/director/3146">Films by Billy Wilder</Link>
        </li>
        <li>
          <Link to="/director/2636">Films by Alfred Hitchcock</Link>
        </li>
        <li>
          <Link to="/director/578">Films by Ridley Scott</Link>
        </li>
        <li>
          <Link to="/director/5026">Films by Akira Kurosawa</Link>
        </li>
        <li>
          <Link to="/director/4762">Films by Paul Thomas Anderson</Link>
        </li>
      </ul>

      <p>
        Many thanks to{' '}
        <a
          href="https://clusterflick.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://clusterflick.com/
        </a>{' '}
        for aggregating this data!
      </p>
    </div>
  );
};

export default Home;

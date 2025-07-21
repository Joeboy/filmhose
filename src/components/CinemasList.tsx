import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CinemasByShortcodeContext } from './Types';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import { sortStringsByTitle } from '../Utils';

const CinemasList = () => {
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const cinemas = Object.values(cinemasByShortcode).sort((a, b) =>
    sortStringsByTitle(a.name, b.name),
  );

  usePageSEO();
  useStructuredData();

  return (
    <div className="cinemas-list">
      <h1>Cinemas</h1>
      <p>This is the list of cinema websites I'm getting data for:</p>
      <ul>
        {cinemas.map((cinema) => (
          <li key={cinema.shortname}>
            <Link to={`/cinemas/${cinema.shortname}`}>{cinema.name}</Link>
          </li>
        ))}
      </ul>
      <p>&nbsp;</p>

      <p>And here they are on a map:</p>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Cinema Locations</h2>
        <iframe
          src="https://data.filmhose.uk/cinema_map.html"
          width="100%"
          height="400px"
          style={{
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          title="Cinema Locations Map"
        />
      </div>

      <p>
        These are a few that I'd like to add, but their websites have so far
        resisted my efforts. There are definitely some gems here so do check
        them out!
      </p>

      <ul>
        <li>
          <a href="https://www.bfi.org.uk/bfi-imax">BFI IMAX</a>
        </li>
        <li>
          <a href="https://thenickel.co.uk">The Nickel</a>
        </li>
        <li>
          <a href="https://www.cine-real.com">Ciné Real</a>
        </li>
        <li>
          <a href="https://www.davidleancinema.org.uk">David Lean Cinema</a>
        </li>
        <li>
          <a href="http://www.cinemamuseum.org.uk">Cinema Museum, Kennington</a>
        </li>
        <li>
          <a href="https://www.theatreship.co.uk">Theatreship, Canary Wharf</a>
        </li>
        <li>
          <a href="https://www.sandsfilms.co.uk">Sands Films</a>
        </li>
        <li>
          <a href="https://www.tnbfc.co.uk/newham-community-cinema">
            Newham Community Cinema
          </a>
        </li>
      </ul>
      <p>&nbsp;</p>
    </div>
  );
};

export default CinemasList;

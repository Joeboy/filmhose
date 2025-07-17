import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CinemasByShortcodeContext } from './Types';

const CinemasList = () => {
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const cinemas = Object.values(cinemasByShortcode).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
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
      <div className="cinema-map" style={{ marginBottom: '2rem' }}>
        <h2>Cinema Locations</h2>
        <iframe
          src="/cinema_map.html"
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

      <p>And this is what's on the TO DO list:</p>

      <ul>
        <li>BFI IMAX</li>
        <li>Cine Lumiere, South Kensington</li>
        <li>The Nickel</li>
        <li>ActOne</li>
        <li>Ciné Reel</li>
        <li>Electric Cinema</li>
        <li>Throwley Yard</li>
        <li>David Lean Cinema</li>
        <li>Chiswick Cinema</li>
        <li>Cinema Museum, Kennington</li>
        <li>Theatreship, Canary Wharf</li>
        <li>Whirled Cinema</li>
        <li>Sands Films</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Feel free to <a href="/help">lend a hand</a> if you have python skills!
      </p>
    </div>
  );
};

export default CinemasList;

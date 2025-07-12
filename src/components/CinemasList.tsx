import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CinemaContext } from './Types';

const CinemasList = () => {
  const cinemas = useContext(CinemaContext);
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
      <p>And this is what's on the TO DO list:</p>

      <ul>
        <li>BFI IMAX</li>
        <li>Cine Lumiere, South Kensington</li>
        <li>The Nickel</li>
        <li>ActOne</li>
        <li>Ciné Reel</li>
        <li>Electric Cinema</li>
        <li>Throwley Yard</li>
        <li>Phoenix Cinema</li>
        <li>David Lean Cinema</li>
        <li>Chiswick Cinema</li>
        <li>Cinema Museum, Kenninton</li>
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

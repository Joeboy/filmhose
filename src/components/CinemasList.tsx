import { useContext } from 'react';
import { CinemaContext } from './CinemaContext';
import { Link } from 'react-router-dom';

const CinemasList = () => {
  const cinemas = useContext(CinemaContext);
  const cinemaArr = Object.values(cinemas);
  return (
    <div className="cinemas-list">
      <h1>Cinemas</h1>
      <p>
        It's still early days, this is the list of cinema websites I'm getting
        data for:
      </p>
      <ul>
        {cinemaArr.map((cinema) => (
          <li key={cinema.shortname}>
            <Link to={`/cinemas/${cinema.shortname}`}>{cinema.name}</Link>
          </li>
        ))}
      </ul>
      <p>&nbsp;</p>
      <p>And this is the slightly oppressive To Do list:</p>

      <ul>
        <li>Kiln Theatre</li>
        <li>BFI IMAX</li>
        <li>The Lumiere Romford</li>
        <li>Cine Lumiere, South Kensington</li>
        <li>The Nickel</li>
        <li>ActOne</li>
        <li>Ciné Reel</li>
        <li>Electric Cinema</li>
        <li>Throwley Yard</li>
        <li>Phoenix Cinema</li>
        <li>David Lean Cinema</li>
        <li>Regent Street Cinema</li>
        <li>Chiswick Cinema</li>
        <li>Bertha Dochouse</li>
        <li>Cinema Museum, Kenninton</li>
        <li>Theatreship, Canary Wharf</li>
        <li>Whirled Cinema</li>
        <li>Rich Mix</li>
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

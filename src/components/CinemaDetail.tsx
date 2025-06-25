import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CinemaContext } from './CinemaContext';

const CinemaDetail = () => {
  const { shortname } = useParams<{ shortname: string }>();
  const cinemas = useContext(CinemaContext);
  const cinema = shortname ? cinemas[shortname] : undefined;

  if (!cinema) {
    return <div>Cinema not found.</div>;
  }

  return (
    <div className="cinema-detail">
      <h1>{cinema.name}</h1>
      {cinema.url && (
        <p>
          Website:{' '}
          <a href={cinema.url} target="_blank" rel="noopener noreferrer">
            {cinema.url}
          </a>
        </p>
      )}
      {cinema.address && <p>Address: {cinema.address}</p>}
      {cinema.phone && <p>Phone: {cinema.phone}</p>}
    </div>
  );
};

export default CinemaDetail;

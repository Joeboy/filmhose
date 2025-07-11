import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CinemaContext } from './CinemaContext';

interface CinemaDetailProps {
  shortname?: string;
}

const CinemaDetail = (props: CinemaDetailProps) => {
  // Use prop if provided, otherwise useParams (for route usage)
  const params = useParams<{ shortname: string }>();
  const shortname = props.shortname || params.shortname;
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
      {cinema.latitude && cinema.longitude && (
        <div style={{ margin: '1em 0' }}>
          <iframe
            title="Google Map"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${cinema.latitude},${cinema.longitude}&z=16&output=embed`}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CinemaDetail;

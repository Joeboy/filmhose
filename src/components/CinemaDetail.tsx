import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CinemasByShortcodeContext } from './Types';
import { usePageTitle } from '../hooks/usePageTitle';

interface CinemaDetailProps {
  shortname?: string;
}

const CinemaDetail = (props: CinemaDetailProps) => {
  const params = useParams<{ shortname: string }>();
  const shortname = props.shortname || params.shortname;
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const cinemas = Object.values(cinemasByShortcode);

  const cinema = cinemas.find((c) => c.shortname === shortname);

  // Set page title
  usePageTitle({ cinemaName: cinema?.name });

  if (!cinema) {
    return <div>Cinema not found.</div>;
  }

  return (
    <div className="cinema-detail">
      <h1>{cinema.name}</h1>
      <p>
        <a href={`/cinema-listings/${cinema.shortcode}`}>What's on</a>
      </p>
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

import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CinemasByShortcodeContext } from './Types';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';

interface CinemaDetailProps {
  shortname?: string;
}

const CinemaDetail = (props: CinemaDetailProps) => {
  const params = useParams<{ shortname: string }>();
  const shortname = props.shortname || params.shortname;
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const cinemas = Object.values(cinemasByShortcode);

  const cinema = cinemas.find((c) => c.shortname === shortname);

  // Set page title and structured data
  usePageSEO({ cinemaName: cinema?.name });
  useStructuredData({ cinema });
  if (!cinema) {
    return <div>Cinema not found.</div>;
  }

  return (
    <div className="cinema-detail">
      <h1>{cinema.name}</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        {cinema.address && (
          <p>
            <strong>Address:</strong> {cinema.address}
          </p>
        )}

        {cinema.phone && (
          <p>
            <strong>Phone:</strong> {cinema.phone}
          </p>
        )}

        {cinema.url && (
          <p>
            <strong>Website:</strong>{' '}
            <a href={cinema.url} target="_blank" rel="noopener noreferrer">
              {cinema.url}
            </a>
          </p>
        )}
        <p>
          <a href={`/cinema-listings/${cinema.shortcode}`}>See what's on</a>
        </p>
      </div>

      {cinema.latitude && cinema.longitude && (
        <div style={{ margin: '1em 0' }}>
          <h3>Location</h3>
          <iframe
            title={`Map showing location of ${cinema.name}`}
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

      <div style={{ marginBottom: '1.5rem' }}>
        <p>
          <strong>Find More London Cinemas:</strong>
        </p>
        <ul style={{ margin: '0.5rem 0' }}>
          <li>
            <a href="/cinemas">Browse all independent cinemas in London</a>
          </li>
          <li>
            <a href="/hosepipe">Today's film listings</a>
          </li>
          <li>
            <a href="/titles">Search for specific films across London</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CinemaDetail;

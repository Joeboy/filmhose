import type { FC } from 'react';
import './ShowTimeItem.css';
import { useContext, useState } from 'react';
import { CinemaContext } from './CinemaContext';
import CinemaDetail from './CinemaDetail';

export interface ShowTime {
  id: string;
  cinema_shortname: string;
  cinema_name: string;
  title: string;
  link: string;
  datetime: string;
  description: string;
  image_src: string;
  thumbnail: string;
  last_updated: string;
  scraper: string;
}

interface Props {
  showtime: ShowTime;
}

const ShowTimeItem: FC<Props> = ({ showtime }) => {
  const [showPopup, setShowPopup] = useState(false);
  const cinemas = useContext(CinemaContext);
  const cinema = cinemas[showtime.cinema_shortname];
  const timeString = new Date(showtime.datetime).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="showtime-listing">
      <h3>
        <a href={showtime.link} target="_blank" rel="noopener noreferrer">
          {showtime.title}
        </a>
      </h3>
      {showtime.thumbnail && (
        <img
          src={
            import.meta.env.VITE_CINESCRAPERS_HOST +
            '/thumbnails/' +
            showtime.thumbnail
          }
          alt={showtime.title + ' thumbnail'}
          className="showtime-thumbnail"
          style={{
            width: '120px',
            height: '120px',
            float: 'right',
            border: '1px solid',
            margin: '.7em .5em 0 .5em',
          }}
        />
      )}
      <p className="showtime-listing-details">
        {timeString} &middot;{' '}
        <span
          className="showtime-cinema-link"
          style={{
            cursor: cinema ? 'pointer' : 'default',
            textDecoration: cinema ? 'underline' : 'none',
          }}
          onClick={() => cinema && setShowPopup(true)}
        >
          {showtime.cinema_name}
        </span>
      </p>
      <p className="showtime-listing-description">
        {showtime.description.length > 200
          ? showtime.description.slice(0, 200) + '...'
          : showtime.description}
      </p>
      <div style={{ clear: 'both' }} />
      {showPopup && cinema && typeof cinema.shortname === 'string' && (
        <div
          className="cinema-popup-overlay"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="cinema-popup"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="cinema-popup-close"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <CinemaDetail shortname={cinema.shortname} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowTimeItem;

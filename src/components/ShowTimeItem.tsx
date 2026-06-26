import type { FC } from 'react';
import { useState } from 'react';
import './ShowTimeItem.css';
import type { ShowTime } from './Types';
import CinemaDetail from './CinemaDetail';

interface Props {
  showtime: ShowTime;
}

const ShowTimeItem: FC<Props> = ({ showtime }) => {
  const [showPopup, setShowPopup] = useState(false);
  const cinema = showtime.cinema;
  const timeString = new Date(showtime.datetime).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const posterSrc = showtime.thumbnail
    ? `${import.meta.env.VITE_CINESCRAPERS_HOST}/thumbnails/${showtime.thumbnail}.jpg`
    : showtime.image_src;

  return (
    <div className="showtime-listing">
      <h3>
        <a href={showtime.link} target="_blank" rel="noopener noreferrer">
          {showtime.title}
        </a>
      </h3>
      {posterSrc && (
        <a href={showtime.link}>
          <img
            src={posterSrc}
            alt={`${showtime.title} movie poster`}
            className="showtime-thumbnail"
            loading="lazy"
            decoding="async"
            width="342"
            height="513"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </a>
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
          {cinema ? cinema.name : 'Unknown'}
        </span>
      </p>
      <p className="showtime-listing-description">
        {showtime.description.length > 200
          ? showtime.description.slice(0, 200) + '...'
          : showtime.description}
      </p>
      {!!showtime.included_movies?.length && (
        <div className="included-movies">
          <p className="included-movies-heading">Included films:</p>
          <ul className="included-movies-list">
            {showtime.included_movies.map((includedMovie) => (
              <li key={`${showtime.id}-${includedMovie.id}`}>
                <div className="included-movie-item">
                  {includedMovie.image_src && (
                    <img
                      src={includedMovie.image_src}
                      alt={`${includedMovie.title} movie poster`}
                      className="included-movie-thumbnail"
                      loading="lazy"
                      decoding="async"
                      width="342"
                      height="513"
                    />
                  )}
                  <div className="included-movie-text">
                    <p className="included-movie-title">
                      {includedMovie.title}
                    </p>
                    <p className="included-movie-overview">
                      {includedMovie.overview.length > 240
                        ? `${includedMovie.overview.slice(0, 240)}...`
                        : includedMovie.overview}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showtime.tmdb_id && (
        <p className="showtime-listing-description">
          <a href={`https://www.themoviedb.org/movie/${showtime.tmdb_id}`}>
            TMDB
          </a>{' '}
          (experimental)
        </p>
      )}
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

import type { FC } from 'react';
import { useContext, useMemo, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import './ShowTimeItem.css';
import { BIGSHOT_DIRECTOR_IDS_SET } from './Constants';
import { MoviesByIdContext, PeopleByIdContext, type ShowTime } from './Types';
import CinemaDetail from './CinemaDetail';
import { getMovieYear } from '../movieYearUtils';

interface Props {
  showtime: ShowTime;
}

const ShowTimeItem: FC<Props> = ({ showtime }) => {
  const [showPopup, setShowPopup] = useState(false);
  const isDirectorPage = !!useMatch('/director/:director_id');
  const isYearPage = !!useMatch('/year/:year');
  const moviesById = useContext(MoviesByIdContext);
  const peopleById = useContext(PeopleByIdContext);
  const cinema = showtime.cinema;
  const timeString = new Date(showtime.datetime).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const posterSrc = showtime.thumbnail
    ? `${import.meta.env.VITE_CINESCRAPERS_HOST}/thumbnails/${showtime.thumbnail}.jpg`
    : showtime.image_src;
  const bigshotDirector = useMemo(() => {
    if (!showtime.movie_id) {
      return null;
    }

    const directors = moviesById[showtime.movie_id]?.directors;
    if (!Array.isArray(directors) || directors.length === 0) {
      return null;
    }

    const matchingDirectorId = directors
      .map((directorId) => String(directorId))
      .find((directorId) => BIGSHOT_DIRECTOR_IDS_SET.has(directorId));

    if (!matchingDirectorId) {
      return null;
    }

    return {
      id: matchingDirectorId,
      name:
        peopleById[matchingDirectorId]?.name ||
        `Director ${matchingDirectorId}`,
    };
  }, [moviesById, peopleById, showtime.movie_id]);
  const movieYear = useMemo(() => {
    if (!showtime.movie_id) {
      return null;
    }

    const year = getMovieYear(moviesById[showtime.movie_id]);
    if (year === null || year >= 2020) {
      return null;
    }

    return year;
  }, [moviesById, showtime.movie_id]);

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
            className="showtime-thumbnail listing-poster"
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
      {!isDirectorPage && bigshotDirector && (
        <p className="showtime-listing-morefrom">
          More from{' '}
          <Link to={`/director/${bigshotDirector.id}`}>
            <strong>{bigshotDirector.name}</strong>
          </Link>
        </p>
      )}
      {!isYearPage && movieYear !== null && (
        <p className="showtime-listing-morefrom">
          More from{' '}
          <Link to={`/year/${movieYear}`}>
            <strong>{movieYear}</strong>
          </Link>
        </p>
      )}

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

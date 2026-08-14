import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import { usePageSEO } from '../hooks/usePageSEO';
import {
  type MovieData,
  MoviesByIdContext,
  SearchSettingsContext,
  ShowtimesContext,
  type ShowTime,
} from './Types';
import { sortStringsByTitle } from '../Utils';

const getDecadeStart = (decadeParam: string | undefined) => {
  if (!decadeParam) return null;

  const match = decadeParam.match(/^(\d{4})s$/);
  if (!match) return null;

  return Number(match[1]);
};

const getMovieYear = (movie?: MovieData) => {
  if (!movie) return null;

  const yearValue = movie.year || movie.releaseDate?.slice(0, 4);
  if (!yearValue) return null;

  const parsedYear = Number(yearValue);
  return Number.isFinite(parsedYear) ? parsedYear : null;
};

const DecadePage: React.FC = () => {
  const { decade } = useParams<{ decade: string }>();

  const showtimes = useContext(ShowtimesContext);
  const movies = useContext(MoviesByIdContext);
  const { searchSettings } = useContext(SearchSettingsContext);

  const decadeStart = getDecadeStart(decade);
  const decadeLabel = decadeStart ? `${decadeStart}s` : undefined;
  const decadeEnd = decadeStart ? decadeStart + 9 : null;

  usePageSEO({ decadeLabel });

  const groupedTitles = useMemo(() => {
    if (!decadeStart || !decadeEnd || !showtimes.length) {
      return [] as Array<{
        normTitle: string;
        showtimes: ShowTime[];
        mostFrequentTitle: string;
        posterSrc: string;
      }>;
    }

    const filteredShowtimes = showtimes.filter((showtime) => {
      if (!searchSettings.selectedCinemas.includes(showtime.cinema_shortcode)) {
        return false;
      }

      const movie = showtime.movie_id ? movies[showtime.movie_id] : undefined;
      const movieYear = getMovieYear(movie);

      return (
        movieYear !== null && movieYear >= decadeStart && movieYear <= decadeEnd
      );
    });

    const groups: Record<string, ShowTime[]> = {};

    filteredShowtimes.forEach((showtime) => {
      const normTitle = showtime.norm_title || showtime.title;
      if (!groups[normTitle]) {
        groups[normTitle] = [];
      }
      groups[normTitle].push(showtime);
    });

    Object.keys(groups).forEach((normTitle) => {
      groups[normTitle].sort((a, b) => {
        const aTime = a.datetimeObj?.toMillis() || 0;
        const bTime = b.datetimeObj?.toMillis() || 0;
        return aTime - bTime;
      });
    });

    return Object.keys(groups)
      .sort(sortStringsByTitle)
      .map((normTitle) => {
        const titleCounts: Record<string, number> = {};
        groups[normTitle].forEach((showtime) => {
          titleCounts[showtime.title] = (titleCounts[showtime.title] || 0) + 1;
        });

        const posterShowtime = groups[normTitle].find(
          (showtime) => !!showtime.image_src,
        );

        return {
          normTitle,
          showtimes: groups[normTitle],
          mostFrequentTitle: Object.entries(titleCounts).reduce((a, b) =>
            a[1] > b[1] ? a : b,
          )[0],
          posterSrc: posterShowtime?.image_src || '',
        };
      });
  }, [
    decadeStart,
    decadeEnd,
    movies,
    searchSettings.selectedCinemas,
    showtimes,
  ]);

  if (!decadeStart || !decadeEnd) {
    return (
      <div>
        <h1>Films by Decade</h1>
        <p>
          That decade route is invalid. Use a path like /decade/1950s or
          /decade/1990s.
        </p>
      </div>
    );
  }

  const totalShowtimes = groupedTitles.reduce(
    (total, group) => total + group.showtimes.length,
    0,
  );

  return (
    <div>
      <h1>Films from the {decadeLabel}</h1>

      <SearchPanel />

      <p
        className="listing-card-showtime-title"
        style={{ marginBottom: '1em' }}
      >
        {groupedTitles.length} title{groupedTitles.length !== 1 ? 's' : ''}{' '}
        found ({totalShowtimes} showtime{totalShowtimes !== 1 ? 's' : ''})
      </p>

      <div className="listing-card-stack">
        {groupedTitles.map(
          ({
            normTitle,
            showtimes: titleShowtimes,
            mostFrequentTitle,
            posterSrc,
          }) => (
            <div key={normTitle} className="listing-card">
              <div className="listing-card-header">
                <div>{mostFrequentTitle}</div>
              </div>

              <div className="listing-card-body">
                {posterSrc && (
                  <img
                    src={posterSrc}
                    alt={`${mostFrequentTitle} movie poster`}
                    loading="lazy"
                    decoding="async"
                    width="135"
                    height="203"
                    className="listing-poster"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <ul className="listing-card-showtime-list">
                  {titleShowtimes.map((showtime, index) => (
                    <li
                      key={`${showtime.cinema_shortcode}-${showtime.datetime}-${index}`}
                      className="listing-card-showtime-item"
                    >
                      <a
                        href={showtime.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {showtime.datetimeObj?.toFormat('EEE d MMM') ||
                          'Date unavailable'}{' '}
                        {showtime.datetimeObj
                          ?.toFormat('h:mm a')
                          .padStart(8, '\u00A0') || 'Time unavailable'}{' '}
                        · {showtime.cinema?.name || 'Cinema unavailable'}
                        <span className="listing-card-showtime-title">
                          {' '}
                          · {showtime.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default DecadePage;

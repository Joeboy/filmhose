import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import ShowTimeItem from './ShowTimeItem';
import { usePageSEO } from '../hooks/usePageSEO';
import {
  MoviesByIdContext,
  SearchSettingsContext,
  ShowtimesContext,
  type ShowTime,
} from './Types';
import { buildMovieIdsByYear } from '../movieYearUtils';

const YearPage = () => {
  const { year } = useParams<{ year: string }>();
  const moviesById = useContext(MoviesByIdContext);
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings } = useContext(SearchSettingsContext);

  const parsedYear = year ? Number(year) : NaN;
  const isValidYear = Number.isInteger(parsedYear) && parsedYear >= 1888;
  const yearLabel = isValidYear ? String(parsedYear) : undefined;

  usePageSEO({ yearLabel });

  const movieIdsByYear = useMemo(
    () => buildMovieIdsByYear(moviesById),
    [moviesById],
  );

  const relevantShowtimes = useMemo(() => {
    if (!isValidYear || !showtimes.length) {
      return [];
    }

    const matchingMovieIds = movieIdsByYear.get(parsedYear);
    if (!matchingMovieIds?.size) {
      return [];
    }

    return showtimes
      .filter(
        (showtime) =>
          showtime.movie_id &&
          matchingMovieIds.has(showtime.movie_id) &&
          searchSettings.selectedCinemas.includes(showtime.cinema_shortcode),
      )
      .sort(
        (a, b) =>
          (a.datetimeObj?.toMillis() || 0) - (b.datetimeObj?.toMillis() || 0),
      );
  }, [
    isValidYear,
    movieIdsByYear,
    parsedYear,
    searchSettings.selectedCinemas,
    showtimes,
  ]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, ShowTime[]> = {};

    relevantShowtimes.forEach((showtime) => {
      const key = showtime.datetimeObj
        ? showtime.datetimeObj.toISODate() || 'unknown'
        : 'unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(showtime);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [relevantShowtimes]);

  if (!isValidYear) {
    return (
      <div>
        <h1>Films by Year</h1>
        <p>That year route is invalid. Use a path like /year/1999.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Films from {parsedYear}</h1>
      <SearchPanel />

      {groupedByDate.length === 0 ? (
        <p>No upcoming screenings found for this year.</p>
      ) : (
        <div>
          {groupedByDate.map(([dateKey, dayShowtimes]) => (
            <div key={dateKey} style={{ marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>
                {dayShowtimes[0]?.datetimeObj?.toFormat('cccc d MMMM') ||
                  dateKey}
              </h2>
              <ul
                className="showtime-list"
                style={{ listStyle: 'none', padding: 0 }}
              >
                {dayShowtimes.map((showtime) => (
                  <li key={showtime.id}>
                    <ShowTimeItem showtime={showtime} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearPage;

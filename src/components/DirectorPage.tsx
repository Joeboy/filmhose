import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import ShowTimeItem from './ShowTimeItem';
import { usePageSEO } from '../hooks/usePageSEO';
import {
  MoviesByIdContext,
  PeopleByIdContext,
  SearchSettingsContext,
  ShowtimesContext,
  type ShowTime,
} from './Types';

const DirectorPage = () => {
  const { director_id } = useParams<{ director_id: string }>();
  const peopleById = useContext(PeopleByIdContext);
  const moviesById = useContext(MoviesByIdContext);
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings } = useContext(SearchSettingsContext);

  const director = director_id ? peopleById[director_id] : undefined;

  const relevantShowtimes = useMemo(() => {
    if (!director_id || !showtimes.length) {
      return [];
    }

    const matchingMovieIds = new Set(
      Object.values(moviesById)
        .filter(
          (movie) =>
            Array.isArray(movie.directors) &&
            movie.directors.some(
              (personId) => String(personId) === String(director_id),
            ),
        )
        .map((movie) => movie.id),
    );

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
  }, [director_id, moviesById, searchSettings.selectedCinemas, showtimes]);

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

  usePageSEO({ directorName: director?.name });

  if (!director) {
    return <div>Director not found.</div>;
  }

  return (
    <div>
      <h1>{director.name}</h1>
      <SearchPanel />

      {groupedByDate.length === 0 ? (
        <p>No upcoming screenings found for this director.</p>
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

export default DirectorPage;

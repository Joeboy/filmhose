import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MoviesByIdContext,
  PeopleByIdContext,
  SearchSettingsContext,
  ShowtimesContext,
} from './Types';

const BIGSHOT_DIRECTOR_IDS = [
  '240',
  '5602',
  '8452',
  '1032',
  '224',
  '3146',
  '2636',
  '578',
  '5026',
  '6648',
  '1776',
  '488',
  '4762',
  '1223',
  '4415',
  '793',
  '9789',
  '39996',
  '11770',
  '1150',
  '6818',
  '10099',
  '12453',
  '4385',
  '8500',
  '11435',
  '40',
  '68',
  '68424',
  '3831',
  '5763',
  '1650',
  '3776',
  '10346',
  '15189',
  '5970',
  '2725',
  '2303',
  '1126',
  '3317',
  '608',
  '5281',
  '7467',
  '30715',
  '4429',
  '309',
  '21684',
  '122423',
  '6817',
  '130030',
  '9888',
  '14392',
  '1769',
  '83287',
];

const DirectorsList: React.FC = () => {
  const moviesById = useContext(MoviesByIdContext);
  const peopleById = useContext(PeopleByIdContext);
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings } = useContext(SearchSettingsContext);

  const formatCount = (value: number, singular: string, plural: string) =>
    `${value} ${value === 1 ? singular : plural}`;

  const directorCounts = useMemo(() => {
    const selectedCinemaSet = new Set(searchSettings.selectedCinemas);
    const counts = new Map<string, number>();
    const filmCounts = new Map<string, Set<string>>();

    showtimes.forEach((showtime) => {
      const movieId = showtime.movie_id;

      if (!movieId || !selectedCinemaSet.has(showtime.cinema_shortcode)) {
        return;
      }

      const movie = moviesById[movieId];
      if (!movie || !Array.isArray(movie.directors)) {
        return;
      }

      movie.directors.forEach((personId) => {
        const normalizedId = String(personId);
        if (!BIGSHOT_DIRECTOR_IDS.includes(normalizedId)) {
          return;
        }

        counts.set(normalizedId, (counts.get(normalizedId) || 0) + 1);

        const directorFilms = filmCounts.get(normalizedId) || new Set<string>();
        directorFilms.add(movieId);
        filmCounts.set(normalizedId, directorFilms);
      });
    });

    return BIGSHOT_DIRECTOR_IDS.map((id) => ({
      id,
      name: peopleById[id]?.name || `Director ${id}`,
      count: counts.get(id) || 0,
      filmCount: filmCounts.get(id)?.size || 0,
    })).sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [moviesById, peopleById, searchSettings.selectedCinemas, showtimes]);

  return (
    <div>
      <h1>Films directed by...</h1>

      <ul>
        {directorCounts.map(({ id, name, count, filmCount }) => {
          const content = `${name} (${formatCount(filmCount, 'film', 'films')}, ${formatCount(count, 'showing', 'showings')})`;

          return (
            <li key={id}>
              {count > 0 ? (
                <Link to={`/director/${id}`}>{content}</Link>
              ) : (
                <span>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DirectorsList;

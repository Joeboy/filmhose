import type { MovieData } from './components/Types';

export const getMovieYear = (movie?: MovieData): number | null => {
  if (!movie) {
    return null;
  }

  const yearValue = movie.year || movie.releaseDate?.slice(0, 4);
  if (!yearValue) {
    return null;
  }

  const parsedYear = Number(yearValue);
  return Number.isFinite(parsedYear) ? parsedYear : null;
};

export const buildMovieIdsByYear = (
  moviesById: Record<string, MovieData>,
): Map<number, Set<string>> => {
  const movieIdsByYear = new Map<number, Set<string>>();

  Object.values(moviesById).forEach((movie) => {
    const year = getMovieYear(movie);
    if (year === null) {
      return;
    }

    if (!movieIdsByYear.has(year)) {
      movieIdsByYear.set(year, new Set<string>());
    }

    movieIdsByYear.get(year)?.add(movie.id);
  });

  return movieIdsByYear;
};

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UsePageTitleOptions {
  cinemaName?: string;
  selectedDate?: string;
  movieTitle?: string;
}

export const usePageTitle = (options: UsePageTitleOptions = {}) => {
  const location = useLocation();
  const { cinemaName, selectedDate, movieTitle } = options;

  useEffect(() => {
    const path = location.pathname;
    let title = 'FilmHose';

    if (path === '/') {
      title = 'FilmHose - London Cinema Listings';
    } else if (path === '/listings') {
      if (selectedDate) {
        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
        title = `Cinema Listings for ${formattedDate} - FilmHose`;
      } else {
        title = 'Cinema Listings - FilmHose';
      }
    } else if (path === '/hosepipe') {
      if (selectedDate) {
        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
        title = `All Cinema Listings for ${formattedDate} - FilmHose`;
      } else {
        title = 'All Cinema Listings - FilmHose';
      }
    } else if (path === '/cinemas') {
      title = 'London Cinemas - FilmHose';
    } else if (path.startsWith('/cinemas/') && cinemaName) {
      title = `${cinemaName} - Cinema Details - FilmHose`;
    } else if (path.startsWith('/cinema-listings/') && cinemaName) {
      title = `${cinemaName} Showtimes - FilmHose`;
    } else if (path === '/titles') {
      title = 'Search Movies by Title - FilmHose';
    } else if (path === '/about') {
      title = 'About FilmHose - London Cinema Listings';
    } else if (path === '/help') {
      title = 'Help Wanted - FilmHose';
    }

    document.title = title;
  }, [location.pathname, cinemaName, selectedDate, movieTitle]);
};

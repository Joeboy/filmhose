import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UsePageSEOOptions {
  cinemaName?: string;
  selectedDate?: string;
  movieTitle?: string;
}

export const usePageSEO = (options: UsePageSEOOptions = {}) => {
  const location = useLocation();
  const { cinemaName, selectedDate, movieTitle } = options;

  useEffect(() => {
    const path = location.pathname;
    let title = 'FilmHose';
    let description =
      "Find cinema showtimes across London's independent and arts cinemas";

    if (path === '/') {
      title = 'FilmHose - London Cinema Listings';
      description =
        "Discover showtimes for independent and arts cinemas across London. Browse today's listings for art house films, repertory screenings, and mainstream movies.";
    } else if (path === '/listings') {
      if (selectedDate) {
        const date = new Date(selectedDate);
        const formattedDate = date.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        });
        title = `Cinema Listings for ${formattedDate} - FilmHose`;
        description = `Browse cinema listings for ${formattedDate} across London's independent and arts cinemas. Discover art house films and repertory screenings.`;
      } else {
        title = 'Cinema Listings - FilmHose';
        description =
          "Browse cinema listings across London's independent and arts cinemas. Discover art house films, repertory screenings, and special events.";
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
        description = `Complete cinema listings for ${formattedDate} across all London cinemas. Find showtimes for every film showing in the city.`;
      } else {
        title = 'All Cinema Listings - FilmHose';
        description =
          'Find showtimes for all films showing in independent and arts cinemas.';
      }
    } else if (path === '/cinemas') {
      title = 'London Cinemas - FilmHose';
      description =
        "Explore London's independent and arts cinemas. Find contact details, locations, and current listings.";
    } else if (path.startsWith('/cinemas/') && cinemaName) {
      title = `${cinemaName} - Cinema Details - FilmHose`;
      description = `Find showtimes, contact details, and location information for ${cinemaName}. Discover what\'s currently showing at this London cinema.`;
    } else if (path.startsWith('/cinema-listings/') && cinemaName) {
      title = `${cinemaName} Showtimes - FilmHose`;
      description = `Current showtimes and film listings for ${cinemaName} in London. Browse upcoming screenings and book tickets for independent and arts cinema.`;
    } else if (path === '/titles') {
      title = 'Search Movies by Title - FilmHose';
      description =
        "Search for movie showtimes by film title across London's independent and arts cinemas. Find where and when your favourite films are screening in the city.";
    } else if (path === '/about') {
      title = 'About FilmHose - London Cinema Listings';
      description = 'The Origin Story. The Mission.';
    } else if (path === '/help') {
      title = 'Help Wanted - FilmHose';
      description =
        'Help improve FilmHose by contributing to FilmHose. Feedback, suggestions, and technical contributions are welcome!.';
    }

    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Update Open Graph description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]',
    );
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    } else {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', description);
      document.head.appendChild(ogDescription);
    }

    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', title);
      document.head.appendChild(ogTitle);
    }
  }, [location.pathname, cinemaName, selectedDate, movieTitle]);
};

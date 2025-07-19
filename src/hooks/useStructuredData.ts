import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Cinema, ShowTime } from '../components/Types';

interface UseStructuredDataOptions {
  cinema?: Cinema;
  showtimes?: ShowTime[];
  selectedDate?: string;
}

export const useStructuredData = (options: UseStructuredDataOptions = {}) => {
  const location = useLocation();
  const { cinema, showtimes, selectedDate } = options;

  useEffect(() => {
    // Remove any existing structured data
    const existingScript = document.querySelector(
      'script[data-structured-data]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    const path = location.pathname;
    let structuredData: any = null;

    // Organization schema for homepage
    if (path === '/') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FilmHose',
        description:
          'Find cinema showtimes across London - independent cinemas, art house films, and mainstream movies',
        url: 'https://filmhose.uk',
        sameAs: ['https://twitter.com/FilmHose'],
        areaServed: {
          '@type': 'City',
          name: 'London',
          addressCountry: 'GB',
        },
      };
    }

    // Cinema detail page schema
    else if (path.startsWith('/cinemas/') && cinema) {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'MovieTheater',
        '@id': `https://filmhose.uk/cinemas/${cinema.shortcode}`,
        name: cinema.name,
        url: cinema.url,
        address: {
          '@type': 'PostalAddress',
          streetAddress: cinema.address,
          addressLocality: 'London',
          addressCountry: 'GB',
          postalCode: cinema.postcode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: cinema.latitude,
          longitude: cinema.longitude,
        },
        priceRange: '£8-£20',
      };

      // Add phone if available
      if (cinema.phone) {
        structuredData.telephone = cinema.phone;
      }
    }

    // Cinema listings page with showtimes
    else if (
      path.startsWith('/cinema-listings/') &&
      cinema &&
      showtimes &&
      showtimes.length > 0
    ) {
      // Create the main cinema schema
      const cinemaSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'MovieTheater',
        '@id': `https://filmhose.uk/cinemas/${cinema.shortcode}`,
        name: cinema.name,
        url: cinema.url,
        address: {
          '@type': 'PostalAddress',
          streetAddress: cinema.address,
          addressLocality: 'London',
          addressCountry: 'GB',
          postalCode: cinema.postcode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: cinema.latitude,
          longitude: cinema.longitude,
        },
        priceRange: '£0-£20',
      };

      // Add phone if available
      if (cinema.phone) {
        cinemaSchema.telephone = cinema.phone;
      }

      // Create screening events for showtimes
      const screeningEvents = showtimes.slice(0, 10).map((showtime) => {
        // Ensure ISO 8601 date format
        const startDate = showtime.datetime.includes('T')
          ? showtime.datetime
          : `${showtime.datetime}T00:00:00+00:00`;

        return {
          '@context': 'https://schema.org',
          '@type': 'ScreeningEvent',
          '@id': `https://filmhose.uk/screening/${showtime.id}`,
          name: showtime.title,
          startDate: startDate,
          location: {
            '@type': 'MovieTheater',
            '@id': `https://filmhose.uk/cinemas/${cinema.shortcode}`,
            name: cinema.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: cinema.address,
              addressLocality: 'London',
              addressCountry: 'GB',
              postalCode: cinema.postcode,
            },
          },
          workFeatured: {
            '@type': 'Movie',
            name: showtime.title,
            description:
              showtime.description || `Screening of ${showtime.title}`,
            image: showtime.thumbnail
              ? `https://data.filmhose.uk/thumbnails/${showtime.thumbnail}.jpg`
              : showtime.image_src,
          },
          image: showtime.thumbnail
            ? `https://data.filmhose.uk/thumbnails/${showtime.thumbnail}.jpg`
            : showtime.image_src,
          url: showtime.link,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        };
      });

      // Return multiple separate schemas
      structuredData = [cinemaSchema, ...screeningEvents];
    }

    // Listings page with multiple cinemas
    else if (
      (path === '/distilled' || path === '/hosepipe') &&
      showtimes &&
      showtimes.length > 0
    ) {
      // Group showtimes by cinema and create events
      const showtimesByCinema = showtimes.slice(0, 20).reduce(
        (acc, showtime) => {
          if (showtime.cinema) {
            if (!acc[showtime.cinema.shortcode]) {
              acc[showtime.cinema.shortcode] = [];
            }
            acc[showtime.cinema.shortcode].push(showtime);
          }
          return acc;
        },
        {} as Record<string, ShowTime[]>,
      );

      const events = Object.values(showtimesByCinema)
        .flat()
        .slice(0, 10)
        .map((showtime) => {
          // Ensure ISO 8601 date format
          const startDate = showtime.datetime.includes('T')
            ? showtime.datetime
            : `${showtime.datetime}T00:00:00+00:00`;

          return {
            '@context': 'https://schema.org',
            '@type': 'ScreeningEvent',
            '@id': `https://filmhose.uk/screening/${showtime.id}`,
            name: showtime.title,
            startDate: startDate,
            location: {
              '@type': 'MovieTheater',
              '@id': showtime.cinema
                ? `https://filmhose.uk/cinemas/${showtime.cinema.shortcode}`
                : undefined,
              name: showtime.cinema?.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: showtime.cinema?.address,
                addressLocality: 'London',
                addressCountry: 'GB',
                postalCode: showtime.cinema?.postcode,
              },
            },
            workFeatured: {
              '@type': 'Movie',
              name: showtime.title,
              description:
                showtime.description || `Screening of ${showtime.title}`,
              image: showtime.thumbnail
                ? `https://data.filmhose.uk/thumbnails/${showtime.thumbnail}.jpg`
                : showtime.image_src,
            },
            image: showtime.thumbnail
              ? `https://data.filmhose.uk/thumbnails/${showtime.thumbnail}.jpg`
              : showtime.image_src,
            url: showtime.link,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode:
              'https://schema.org/OfflineEventAttendanceMode',
          };
        });

      structuredData = events;
    }

    // Cinemas list page
    else if (path === '/cinemas') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'London Cinemas',
        description: 'Independent and arts cinemas across London',
        url: 'https://filmhose.uk/cinemas',
      };
    }

    // Add the structured data to the page
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData, null, 2);
      document.head.appendChild(script);
    }
  }, [location.pathname, cinema, showtimes, selectedDate]);
};

import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About';
import AppHeader from './components/AppHeader';
import CinemaDetail from './components/CinemaDetail';
import CinemaListings from './components/CinemaListings';
import CinemasList from './components/CinemasList';
import Home from './components/Home';
import Listings from './components/Listings';
import NotFound from './components/NotFound';
import Titles from './components/Titles';
import {
  type Cinema,
  type SearchSettings,
  type ShowTime,
  CinemasByShortcodeContext,
  LoadingShowtimesContext,
  SearchSettingsContext,
  SelectedDateContext,
  ShowtimesContext,
} from './components/Types';
import { toNaiveDateString } from './toNaiveDateString';
import { safeFetch } from './Utils';

// Type definitions for the new data format
interface Movie {
  id: string;
  title: string;
  normalizedTitle: string;
  overview?: string;
  posterPath?: string;
  genres: Array<string | number>;
  included_movie_ids?: Array<string | number>;
}

interface RawShowtime {
  dateTime: string;
  bookingUrl: string;
  category: string;
  url: string;
  venue_id: number;
  movie_id: string;
}

interface CinescrapersData {
  showtimes: RawShowtime[];
  venues: Array<{
    id: number;
    slug: string;
    name: string;
    address?: string;
    geo?: {
      lat: number;
      lon: number;
    };
    structure?: string;
    type?: string;
    url?: string;
    socials?: Record<string, string | null>;
    groupName?: string | null;
  }>;
  movies: Movie[];
}

const App: FC = () => {
  const [rawShowtimes, setRawShowtimes] = useState<RawShowtime[]>([]);
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [cinemasByShortcode, setCinemasByShortcode] = useState<
    Record<string, Cinema>
  >({});
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date()),
  );
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [hasInitializedCinemas, setHasInitializedCinemas] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    selectedCinemas: [],
  });

  // Load cinescrapers.json data and build id-to-data maps at startup
  useEffect(() => {
    setLoadingShowtimes(true);

    safeFetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/clusterflick.json')
      .then((data) => {
        const cinescrapersData = data as CinescrapersData;

        // Build movie map (id -> movie) for O(1) lookups
        const movieMap: Record<string, Movie> = {};
        for (const movie of cinescrapersData.movies) {
          movieMap[movie.id] = movie;
        }
        setMovies(movieMap);

        // Build cinemas map from venues (using id as shortcode)
        const cinemaMap: Record<string, Cinema> = {};
        for (const venue of cinescrapersData.venues) {
          const cinema: Cinema = {
            shortcode: venue.id.toString(),
            shortname: venue.slug,
            name: venue.name,
            url: venue.url || '',
            address: venue.address,
            latitude: venue.geo?.lat || 0,
            longitude: venue.geo?.lon || 0,
          };
          cinemaMap[venue.id.toString()] = cinema;
        }
        setCinemasByShortcode(cinemaMap);

        // Set raw showtimes
        setRawShowtimes(cinescrapersData.showtimes);
        setLoadingShowtimes(false);
      })
      .catch((error) => {
        console.error('Failed to load cinescrapers.json:', error);
        setLoadingShowtimes(false);
      });

    // TODO: Load TMDB recommendations if tmdb_id is added to showtime data
  }, []);

  // Set all cinemas as selected by default when cinemas are loaded (only once)
  useEffect(() => {
    if (Object.keys(cinemasByShortcode).length > 0 && !hasInitializedCinemas) {
      // Check if there are saved cinema settings in cookies
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const savedCinemas = getCookieValue('selectedCinemas');
      let initialSelectedCinemas: string[] = Object.keys(cinemasByShortcode);

      if (savedCinemas && savedCinemas.trim() !== '') {
        try {
          const cookieData = JSON.parse(decodeURIComponent(savedCinemas));
          if (Array.isArray(cookieData.cinemas)) {
            // Filter to only include valid cinema shortcodes that exist
            initialSelectedCinemas = cookieData.cinemas.filter(
              (shortcode: string) =>
                Object.keys(cinemasByShortcode).includes(shortcode),
            );
          }
        } catch (error) {
          // Cookie parsing failed, use default (all cinemas)
        }
      }

      setSearchSettings((prevSettings) => ({
        ...prevSettings,
        selectedCinemas: initialSelectedCinemas,
      }));
      setHasInitializedCinemas(true);
    }
  }, [cinemasByShortcode, hasInitializedCinemas]);

  useEffect(() => {
    if (
      rawShowtimes.length &&
      Object.keys(cinemasByShortcode).length &&
      Object.keys(movies).length
    ) {
      // Transform showtimes from new format to ShowTime interface
      const nowLondon = DateTime.now().setZone('Europe/London');
      const cutoff = nowLondon.minus({ minutes: 30 });

      const processedShowtimes = rawShowtimes
        .map((rawShowtime) => {
          const movie = movies[rawShowtime.movie_id];
          const venueId = rawShowtime.venue_id.toString();
          const imageSrc = movie?.posterPath
            ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
            : '';
          const includedMovies = (movie?.included_movie_ids || [])
            .map((id) => movies[String(id)])
            .filter((includedMovie): includedMovie is Movie => !!includedMovie)
            .map((includedMovie) => ({
              id: includedMovie.id,
              title: includedMovie.title,
              overview: includedMovie.overview || '',
              image_src: includedMovie.posterPath
                ? `https://image.tmdb.org/t/p/w342${includedMovie.posterPath}`
                : '',
            }));

          const showtime: ShowTime = {
            id: `${venueId}-${rawShowtime.movie_id}-${rawShowtime.dateTime}`,
            cinema_shortcode: venueId,
            cinema: cinemasByShortcode[venueId],
            title: movie?.title || '',
            norm_title: movie?.normalizedTitle || '',
            link: rawShowtime.url,
            datetime: rawShowtime.dateTime,
            datetimeObj: DateTime.fromISO(rawShowtime.dateTime, {
              zone: 'Europe/London',
            }),
            description: movie?.overview || rawShowtime.category,
            image_src: imageSrc,
            thumbnail: '',
            last_updated: new Date().toISOString(),
            scraper: 'cinescrapers',
            included_movies: includedMovies,
          };

          return showtime;
        })
        // Filter out past showtimes
        .filter(({ datetimeObj }) => datetimeObj && datetimeObj > cutoff)
        .sort(
          (a, b) =>
            (a.datetimeObj?.toMillis() || 0) - (b.datetimeObj?.toMillis() || 0),
        );

      setShowtimes(processedShowtimes);
    }
  }, [rawShowtimes, cinemasByShortcode, movies]);

  return (
    <Router>
      <div>
        <AppHeader />
        <div className="container">
          <CinemasByShortcodeContext.Provider value={cinemasByShortcode}>
            <SearchSettingsContext.Provider
              value={{
                searchSettings,
                setSearchSettings,
              }}
            >
              <LoadingShowtimesContext.Provider
                value={{ loadingShowtimes, setLoadingShowtimes }}
              >
                <ShowtimesContext.Provider value={showtimes}>
                  <SelectedDateContext.Provider
                    value={{ selectedDate, setSelectedDate }}
                  >
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/distilled" element={<Listings />} />
                      <Route path="/hosepipe" element={<Listings />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/cinemas" element={<CinemasList />} />
                      <Route
                        path="/cinemas/:shortname"
                        element={<CinemaDetail />}
                      />
                      <Route
                        path="/cinema-listings/:cinema_shortcode"
                        element={<CinemaListings />}
                      />
                      <Route path="/titles" element={<Titles />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SelectedDateContext.Provider>
                </ShowtimesContext.Provider>
              </LoadingShowtimesContext.Provider>
            </SearchSettingsContext.Provider>
          </CinemasByShortcodeContext.Provider>
        </div>
      </div>
    </Router>
  );
};

export default App;

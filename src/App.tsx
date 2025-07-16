import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About';
import AppHeader from './components/AppHeader';
import CinemaDetail from './components/CinemaDetail';
import CinemasList from './components/CinemasList';
import HelpWanted from './components/HelpWanted';
import Home from './components/Home';
import Listings from './components/Listings';
import Titles from './components/Titles';
import {
  type Cinema,
  type ShowTime,
  type SearchSettings,
  CinemasByShortcodeContext,
  SearchSettingsContext,
  LoadingShowtimesContext,
  ShowtimesContext,
  SelectedDateContext,
} from './components/Types';
import { toNaiveDateString } from './toNaiveDateString';

const App: FC = () => {
  const [rawShowtimes, setRawShowtimes] = useState<ShowTime[]>([]);
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [cinemasByShortcode, setCinemasByShortcode] = useState<
    Record<string, Cinema>
  >({});
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date()),
  );
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [hasInitializedCinemas, setHasInitializedCinemas] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    selectedCinemas: [],
  });

  // These useEffects fetch the showtime and cinema data and fix it up so we
  // can use it easily
  useEffect(() => {
    setLoadingShowtimes(true);
    fetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => {
        setRawShowtimes(data as ShowTime[]);
        setLoadingShowtimes(false);
      });
    fetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/cinemas.json')
      .then((res) => res.json())
      .then((cinemaData) => {
        const cinemaMap: Record<string, Cinema> = {};
        for (const c of cinemaData as Cinema[]) {
          if (c.shortcode) {
            cinemaMap[c.shortcode] = c;
          }
        }
        setCinemasByShortcode(cinemaMap);
      });
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
      console.log(savedCinemas);
      let initialSelectedCinemas: string[];

      if (savedCinemas && savedCinemas.trim() !== '') {
        // Split concatenated shortcodes into 2-character chunks
        const cinemaShortcodes = savedCinemas.match(/.{1,2}/g) || [];
        // Filter to only include valid cinema shortcodes that exist
        initialSelectedCinemas = cinemaShortcodes.filter((shortcode) =>
          Object.keys(cinemasByShortcode).includes(shortcode),
        );
      } else {
        // Default to all cinemas if no saved settings
        initialSelectedCinemas = Object.keys(cinemasByShortcode);
      }

      setSearchSettings((prevSettings) => ({
        ...prevSettings,
        selectedCinemas: initialSelectedCinemas,
      }));
      setHasInitializedCinemas(true);
    }
  }, [cinemasByShortcode, hasInitializedCinemas]);

  useEffect(() => {
    if (rawShowtimes.length && Object.keys(cinemasByShortcode).length) {
      // Update each showtime object with cinema details and DateTime object
      const nowLondon = DateTime.now().setZone('Europe/London');
      const cutoff = nowLondon.minus({ minutes: 30 });
      const processedShowtimes = rawShowtimes
        .map((showtime) => ({
          ...showtime,
          cinema: cinemasByShortcode[showtime.cinema_shortcode],
          datetimeObj: DateTime.fromISO(showtime.datetime, {
            zone: 'Europe/London',
          }),
        }))
        // Filter out past showtimes
        .filter(({ datetimeObj }) => datetimeObj && datetimeObj > cutoff)
        .sort(
          (a, b) =>
            (a.datetimeObj?.toMillis() || 0) - (b.datetimeObj?.toMillis() || 0),
        );
      setShowtimes(processedShowtimes);
    }
  }, [rawShowtimes, cinemasByShortcode]);

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
                      <Route path="/listings" element={<Listings />} />
                      <Route path="/hosepipe" element={<Listings />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/help" element={<HelpWanted />} />
                      <Route path="/cinemas" element={<CinemasList />} />
                      <Route
                        path="/cinemas/:shortname"
                        element={<CinemaDetail />}
                      />
                      <Route path="/titles" element={<Titles />} />
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

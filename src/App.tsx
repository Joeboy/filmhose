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
import SearchPanel from './components/SearchPanel';
import ShowTimeList from './components/ShowTimeList';
import {
  type Cinema,
  type ShowTime,
  CinemasByShortcodeContext,
} from './components/Types';
import { toNaiveDateString } from './toNaiveDateString';

const App: FC = () => {
  const [rawShowtimes, setRawShowtimes] = useState<ShowTime[]>([]);
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [cinemasByShortcode, setCinemasByShortcode] = useState<
    Record<string, Cinema>
  >({});
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date())
  );
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);
  const [excludeManyShowings, setExcludeManyShowings] = useState(false);
  const [selectedCinemas, setSelectedCinemas] = useState<string[]>([]);

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
            (a.datetimeObj?.toMillis() || 0) - (b.datetimeObj?.toMillis() || 0)
        );
      setShowtimes(processedShowtimes);
    }
  }, [rawShowtimes, cinemasByShortcode]);

  // Filter by selected date
  let filteredShowtimes: ShowTime[] = showtimes.filter(({ datetimeObj }) => {
    if (!datetimeObj) return false;
    const key = toNaiveDateString(datetimeObj.toJSDate());
    return key === selectedDate;
  });

  // Filter by selected cinemas if any are selected
  if (selectedCinemas.length > 0) {
    filteredShowtimes = filteredShowtimes.filter((show) =>
      selectedCinemas.includes(show.cinema_shortcode)
    );
  }

  // Filter out films with more than 10 showings if excludeManyShowings is true
  if (excludeManyShowings) {
    const titleCounts: Record<string, number> = {};
    for (const show of filteredShowtimes) {
      titleCounts[show.norm_title] = (titleCounts[show.norm_title] || 0) + 1;
    }
    filteredShowtimes = filteredShowtimes.filter(
      (show) => titleCounts[show.norm_title] <= 10
    );
  }

  return (
    <Router>
      <div>
        <AppHeader />
        <div className="container">
          <CinemasByShortcodeContext.Provider value={cinemasByShortcode}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <SearchPanel
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      excludeManyShowings={excludeManyShowings}
                      setExcludeManyShowings={setExcludeManyShowings}
                      selectedCinemas={selectedCinemas}
                      setSelectedCinemas={setSelectedCinemas}
                    />
                    <ShowTimeList
                      showtimes={filteredShowtimes}
                      date={new Date(selectedDate)}
                      loading={loadingShowtimes}
                    />
                  </>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<HelpWanted />} />
              <Route path="/cinemas" element={<CinemasList />} />
              <Route path="/cinemas/:shortname" element={<CinemaDetail />} />
            </Routes>
          </CinemasByShortcodeContext.Provider>
        </div>
      </div>
    </Router>
  );
};

export default App;

import { DateTime } from 'luxon';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About';
import AppHeader from './components/AppHeader';
import Calendar from './components/Calendar';
import CinemaDetail from './components/CinemaDetail';
import CinemasList from './components/CinemasList';
import HelpWanted from './components/HelpWanted';
import ShowTimeList from './components/ShowTimeList';
import { type Cinema, type ShowTime, CinemaContext } from './components/Types';
import { toNaiveDateString } from './toNaiveDateString';

const App: FC = () => {
  const [rawShowtimes, setRawShowtimes] = useState<ShowTime[]>([]);
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date())
  );
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

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
        setCinemas(cinemaData as Cinema[]);
      });
  }, []);
  useEffect(() => {
    if (rawShowtimes.length && cinemas.length) {
      const cinemaMap: Record<string, Cinema> = {};
      for (const c of cinemas) {
        if (c.shortcode) {
          cinemaMap[c.shortcode] = c;
        }
      }
      setShowtimes(
        rawShowtimes.map((showtime) => ({
          ...showtime,
          cinema: cinemaMap[showtime.cinema_shortcode],
        }))
      );
    }
  }, [rawShowtimes, cinemas]);

  // Get current time in London and subtract 1 hour
  const nowLondon = DateTime.now().setZone('Europe/London');
  const cutoff = nowLondon.minus({ minutes: 30 });

  const upcomingShowtimes = showtimes
    .map((showtime) => ({
      ...showtime,
      datetimeObj: DateTime.fromISO(showtime.datetime, {
        zone: 'Europe/London',
      }),
    }))
    .filter(({ datetimeObj }) => {
      const key = toNaiveDateString(datetimeObj.toJSDate());
      return key === selectedDate && datetimeObj > cutoff;
    })
    .sort((a, b) => a.datetimeObj.toMillis() - b.datetimeObj.toMillis());
  return (
    <Router>
      <div>
        <AppHeader />
        <div className="container">
          <CinemaContext.Provider value={cinemas}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Calendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                    <ShowTimeList
                      showtimes={upcomingShowtimes}
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
          </CinemaContext.Provider>
        </div>
      </div>
    </Router>
  );
};

export default App;

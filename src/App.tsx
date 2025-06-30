import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import './App.css';
import type { FC } from 'react';
import { type ShowTime } from './components/ShowTimeItem';
import Calendar from './components/Calendar';
import ShowTimeList from './components/ShowTimeList';
import { toNaiveDateString } from './toNaiveDateString';
import About from './components/About';
import HelpWanted from './components/HelpWanted';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import { CinemaContext, type Cinema } from './components/CinemaContext';
import CinemasList from './components/CinemasList';
import CinemaDetail from './components/CinemaDetail';

const App: FC = () => {
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [cinemas, setCinemas] = useState<Record<string, Cinema>>({});
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date())
  );
  const [loadingShowtimes, setLoadingShowtimes] = useState(true);

  useEffect(() => {
    setLoadingShowtimes(true);
    fetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => {
        setShowtimes(data as ShowTime[]);
        setLoadingShowtimes(false);
      });
    fetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/cinemas.json')
      .then((res) => res.json())
      .then((cinemaData) => {
        if (Array.isArray(cinemaData)) {
          const mapping: Record<string, Cinema> = {};
          for (const c of cinemaData) {
            if (c.shortname) {
              mapping[c.shortname] = c;
            }
          }
          setCinemas(mapping);
        } else {
          setCinemas({});
        }
      });
  }, []);

  // Get current time in London and subtract 1 hour
  const nowLondon = DateTime.now().setZone('Europe/London');
  const cutoff = nowLondon.minus({ hours: 1 });

  const upcomingShowtimes = showtimes
    .map((show) => ({
      ...show,
      datetimeObj: DateTime.fromISO(show.datetime, { zone: 'Europe/London' }),
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

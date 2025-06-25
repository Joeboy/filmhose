import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetch(import.meta.env.VITE_CINESCRAPERS_HOST + '/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => {
        // Patch records: if 'cinema' exists, set both 'cinema_shortname' and 'cinema_name' to its value
        const patched = Array.isArray(data)
          ? data.map((rec) => {
              if (rec.cinema) {
                return {
                  ...rec,
                  cinema_shortname: rec.cinema,
                  cinema_name: rec.cinema,
                };
              }
              return rec;
            })
          : data;
        setShowtimes(patched as ShowTime[]);
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

  const upcomingShowtimes = showtimes
    .map((show) => ({
      ...show,
      datetimeObj: new Date(show.datetime),
    }))
    .filter(({ datetimeObj }) => {
      const key = toNaiveDateString(datetimeObj);
      return key === selectedDate;
    })
    .sort((a, b) => a.datetimeObj.getTime() - b.datetimeObj.getTime());

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

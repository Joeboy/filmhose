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

const App: FC = () => {
  const [data, setData] = useState<ShowTime[]>([]);
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
        setData(patched as ShowTime[]);
      });
  }, []);

  const upcomingShowtimes = data
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

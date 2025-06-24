import { useEffect, useState } from 'react';
import './App.css';
import type { FC } from 'react';
import { type ShowTime } from './components/ShowTimeItem';
import Calendar from './components/Calendar';
import ShowTimeList from './components/ShowTimeList';
import { formatDateLabel } from './formatDateLabel';
import { toNaiveDateString } from './toNaiveDateString';

const App: FC = () => {
  const [data, setData] = useState<ShowTime[]>([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    toNaiveDateString(new Date())
  );

  useEffect(() => {
    fetch('https://data.filmhose.uk/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => setData(data as ShowTime[]));
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
    <div>
      <div id="header">
        <div className="container">
          <h1>
            <a href="/">FilmHose</a>
          </h1>
          <h2>Listings for London's independent / arts cinemas</h2>
        </div>
      </div>
      <div className="container">
        <p>
          Go <a href="https://github.com/Joeboy/cinescrapers">here</a> for more
          info about this project.
        </p>
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <ShowTimeList
          showtimes={upcomingShowtimes}
          date={new Date(selectedDate)}
        />
      </div>
    </div>
  );
};

export default App;

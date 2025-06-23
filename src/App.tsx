import { useEffect, useState } from 'react';
import './App.css';
import type { FC } from 'react';
import ShowTimeItem, { type ShowTime } from './components/ShowTimeItem';
import DateNav from './components/DateNav';

const App: FC = () => {
  const [data, setData] = useState<ShowTime[]>([]);
  const [weekRange, setWeekRange] = useState<'this' | 'next'>('this');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetch('https://data.filmhose.uk/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => setData(data as ShowTime[]));
  }, []);

  const formatDateLabel = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const baseLabel = date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).replace(/[\.,]/g, ''); // remove trailing period after abbrev'd day

    if (isSameDay(date, today)) return `Today, ${baseLabel}`;
    if (isSameDay(date, tomorrow)) return `Tomorrow, ${baseLabel}`;
    return baseLabel;
  };

  const upcomingShowtimes = data
    .map((show) => ({
      ...show,
      datetimeObj: new Date(show.datetime),
    }))
    .filter(({ datetimeObj }) => {
      const key = datetimeObj.toISOString().split('T')[0];
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
        <DateNav
          weekRange={weekRange}
          setWeekRange={setWeekRange}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          formatDateLabel={formatDateLabel}
        />

        <p>
          See <a href="https://github.com/Joeboy/cinescrapers">here</a> if
          you're a nerd and want to know where this data comes from.
        </p>
        <h2>{formatDateLabel(new Date(selectedDate))}</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {upcomingShowtimes.map((showtime) => (
            <li key={showtime.id}>
              <ShowTimeItem showtime={showtime} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

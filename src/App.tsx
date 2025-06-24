import { useEffect, useState } from 'react';
import './App.css';
import type { FC } from 'react';
import { type ShowTime } from './components/ShowTimeItem';
import { DateNav, type WeekRange } from './components/DateNav';
import ShowTimeList from './components/ShowTimeList';

const App: FC = () => {
  const [data, setData] = useState<ShowTime[]>([]);
  const [weekRange, setWeekRange] = useState<WeekRange>('this');

  const [selectedDates, setSelectedDates] = useState<Record<WeekRange, string>>(
    () => {
      const today = new Date().toISOString().split('T')[0];
      return { this: today, next: '' };
    }
  );

  const selectedDate = selectedDates[weekRange];

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

    const baseLabel = date
      .toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
      .replace(/[\.,]/g, '');

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
          setWeekRange={(key) => {
            setWeekRange(key);
            setSelectedDates((prev) => {
              const wk = key as WeekRange;
              const existing = prev[wk];
              return {
                ...prev,
                [wk]: existing || new Date().toISOString().split('T')[0],
              };
            });
          }}
          selectedDate={selectedDate}
          setSelectedDate={(date) =>
            setSelectedDates((prev) => ({ ...prev, [weekRange]: date }))
          }
          formatDateLabel={formatDateLabel}
        />
        <h2 className="date-heading">
          {formatDateLabel(new Date(selectedDate))}
        </h2>
        <p>
          <i>
            See <a href="https://github.com/Joeboy/cinescrapers">here</a> if
            you're a nerd and want to know where this data comes from.
          </i>
        </p>
        <ShowTimeList showtimes={upcomingShowtimes} />
      </div>
    </div>
  );
};

export default App;

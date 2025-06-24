import { useEffect, useState } from 'react';
import './App.css';
import type { FC } from 'react';
import { type ShowTime } from './components/ShowTimeItem';
import { DateNav, type WeekRange } from './components/DateNav';
import ShowTimeList from './components/ShowTimeList';
import { formatDateLabel } from './formatDateLabel';

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

        <ShowTimeList
          showtimes={upcomingShowtimes}
          date={new Date(selectedDate)}
        />
      </div>
    </div>
  );
};

export default App;

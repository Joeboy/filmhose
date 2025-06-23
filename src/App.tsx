import { useEffect, useState } from 'react';
import './App.css';
import type { FC } from 'react';
import ShowTimeItem, { type ShowTime } from './components/ShowTimeItem';

const App: FC = () => {
  const [data, setData] = useState<ShowTime[]>([]);

  useEffect(() => {
    fetch('https://data.filmhose.uk/cinescrapers.json')
      .then((res) => res.json())
      .then((data) => setData(data as ShowTime[]));
  }, []);

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 6); // Today + 6 = 7 days total
  endDate.setHours(23, 59, 59, 999);

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
    });

    if (isSameDay(date, today)) return `Today, ${baseLabel}`;
    if (isSameDay(date, tomorrow)) return `Tomorrow, ${baseLabel}`;
    return baseLabel;
  };

  const upcomingShowtimes = data
    .map((show) => ({
      ...show,
      datetimeObj: new Date(show.datetime),
    }))
    .filter(({ datetimeObj }) => datetimeObj >= now && datetimeObj <= endDate)
    .sort((a, b) => a.datetimeObj.getTime() - b.datetimeObj.getTime());

  const grouped: Record<string, { label: string; shows: ShowTime[] }> = {};
  for (const showtime of upcomingShowtimes) {
    const dateKey = showtime.datetimeObj.toISOString().split('T')[0]; // YYYY-MM-DD
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        label: formatDateLabel(showtime.datetimeObj),
        shows: [],
      };
    }
    grouped[dateKey].shows.push(showtime);
  }

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
          See <a href="https://github.com/Joeboy/cinescrapers">here</a> for more
          info. Showing this week:
        </p>
        {Object.entries(grouped).map(([dateKey, { label, shows }]) => (
          <section
            key={dateKey}
            // style={{
            //   marginBottom: '2rem',
            //   backgroundColor: '#fff',
            //   padding: '1rem',
            //   borderRadius: '4px',
            //   border: '1px solid #ccc',
            // }}
          >
            <h2 style={{ marginTop: 0 }}>{label}</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {shows.map((showtime) => (
                <li key={showtime.id}>
                  <ShowTimeItem showtime={showtime} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default App;

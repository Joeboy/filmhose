import { DateTime } from 'luxon';
import React from 'react';
import { formatDateLabel } from '../formatDateLabel';
import type { ShowTime } from './Types';
import ShowTimeItem from './ShowTimeItem';
import './ShowTimeList.css';

interface ShowTimeListProps {
  showtimes: ShowTime[];
  date: Date;
  loading?: boolean;
}

const ShowTimeList: React.FC<ShowTimeListProps> = ({
  showtimes,
  date,
  loading,
}) => {
  let emptyMsg = 'Could not find any matching showtimes.';
  if (!loading && showtimes.length === 0) {
    const nowLondon = DateTime.now().setZone('Europe/London');
    const isToday =
      nowLondon.toISODate() ===
      DateTime.fromJSDate(date).setZone('Europe/London').toISODate();
    if (isToday && nowLondon.hour >= 21) {
      emptyMsg =
        "Could not find any more showtimes for today (perhaps because it's quite late - maybe try tomorrow)";
    }
  }
  return (
    <>
      <h2 className="date-heading">{formatDateLabel(date)}</h2>
      {loading ? (
        <p className="showtime-list-loading">Loading...</p>
      ) : showtimes.length === 0 ? (
        <p className="showtime-list-empty">{emptyMsg}</p>
      ) : (
        <ul className="showtime-list">
          {showtimes.map((showtime) => (
            <li key={showtime.id}>
              <ShowTimeItem showtime={showtime} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ShowTimeList;

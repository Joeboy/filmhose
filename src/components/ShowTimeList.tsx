import React from 'react';
import ShowTimeItem, { type ShowTime } from './ShowTimeItem';
import { formatDateLabel } from '../formatDateLabel';
import './ShowTimeList.css';

interface ShowTimeListProps {
  showtimes: ShowTime[];
  date: Date;
  loading?: boolean;
}

const ShowTimeList: React.FC<ShowTimeListProps> = ({ showtimes, date, loading }) => (
  <>
    <h2 className="date-heading">{formatDateLabel(date)}</h2>
{loading ? (
  <p className="showtime-list-loading">Loading...</p>
) : showtimes.length === 0 ? (
  <p className="showtime-list-empty">Could not find any matching showtimes.</p>
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

export default ShowTimeList;

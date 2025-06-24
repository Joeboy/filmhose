import React from 'react';
import ShowTimeItem, { type ShowTime } from './ShowTimeItem';
import './ShowTimeList.css';

interface ShowTimeListProps {
  showtimes: ShowTime[];
  date: Date;
  formatDateLabel: (date: Date) => string;
}

const ShowTimeList: React.FC<ShowTimeListProps> = ({ showtimes, date, formatDateLabel }) => (
  <>
    <h2 className="date-heading">{formatDateLabel(date)}</h2>
    <ul className="showtime-list">
      {showtimes.map((showtime) => (
        <li key={showtime.id}>
          <ShowTimeItem showtime={showtime} />
        </li>
      ))}
    </ul>
  </>
);

export default ShowTimeList;

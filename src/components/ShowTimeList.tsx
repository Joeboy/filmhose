import React from 'react';
import ShowTimeItem, { type ShowTime } from './ShowTimeItem';
import './ShowTimeList.css';

interface ShowTimeListProps {
  showtimes: ShowTime[];
}

const ShowTimeList: React.FC<ShowTimeListProps> = ({ showtimes }) => (
  <ul className="showtime-list">
    {showtimes.map((showtime) => (
      <li key={showtime.id}>
        <ShowTimeItem showtime={showtime} />
      </li>
    ))}
  </ul>
);

export default ShowTimeList;

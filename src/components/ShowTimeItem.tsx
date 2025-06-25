import type { FC } from 'react';
import './ShowTimeItem.css';

export interface ShowTime {
  id: string;
  cinema_shortname: string;
  cinema_name: string;
  title: string;
  link: string;
  datetime: string;
  description: string;
  image_src: string;
  last_updated: string;
  scraper: string;
}

interface Props {
  showtime: ShowTime;
}

const ShowTimeItem: FC<Props> = ({ showtime }) => {
  const timeString = new Date(showtime.datetime).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="showtime-listing">
      <h3>
        <a href={showtime.link} target="_blank" rel="noopener noreferrer">
          {showtime.title}
        </a>
      </h3>
      <p className="showtime-listing-details">
        {timeString} &middot; {showtime.cinema_name}
      </p>
      <p className="showtime-listing-description">
        {showtime.description.length > 200
          ? showtime.description.slice(0, 200) + '...'
          : showtime.description}
      </p>
    </div>
  );
};

export default ShowTimeItem;

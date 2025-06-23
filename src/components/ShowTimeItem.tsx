import type { FC } from 'react';

export interface ShowTime {
  id: string;
  cinema: string;
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
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ marginTop: '.5rem' }}>
      <p>
        <a href={showtime.link} target="_blank" rel="noopener noreferrer">
          {showtime.title} &middot; {showtime.cinema} &middot; {timeString}
        </a>
      </p>
      {showtime.description.length > 200
        ? showtime.description.slice(0, 200) + '...'
        : showtime.description}
      <br />&nbsp;
        <hr></hr>
    </div>
  );
};

export default ShowTimeItem;

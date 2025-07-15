import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDateLabel } from '../formatDateLabel';
import ShowTimeItem from './ShowTimeItem';
import './ShowTimeList.css';
import { CinemasByShortcodeContext, LoadingShowtimesContext, type ShowTime } from './Types';

interface ShowTimeListProps {
  showtimes: ShowTime[];
  date: Date;
}

const ShowTimeList: React.FC<ShowTimeListProps> = ({
  showtimes,
  date,
}) => {
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const { loadingShowtimes } = useContext(LoadingShowtimesContext);

  const [searchParams] = useSearchParams();
  const cinemas_param = searchParams.get('cinemas');
  const cinema_shortcodes: string[] = cinemas_param
    ? cinemas_param.match(/.{1,2}/g) ?? []
    : [];

  let emptyMsg = 'Could not find any matching showtimes.';
  if (!loadingShowtimes && showtimes.length === 0) {
    const nowLondon = DateTime.now().setZone('Europe/London');
    const isToday =
      nowLondon.toISODate() ===
      DateTime.fromJSDate(date).setZone('Europe/London').toISODate();
    if (isToday && nowLondon.hour >= 21) {
      emptyMsg =
        "Could not find any more showtimes for today (perhaps because it's quite late - maybe try tomorrow)";
    }
  }

  // Filter showtimes if cinema_shortcodes is present and non-empty
  const filteredShowtimes =
    cinema_shortcodes.length > 0
      ? showtimes.filter(
          (showtime) =>
            showtime.cinema &&
            cinema_shortcodes.includes(showtime.cinema.shortcode)
        )
      : showtimes;

  // Get cinema names for the selected shortcodes
  const selectedCinemas = cinema_shortcodes
    .map((code) => cinemasByShortcode[code])
    .filter(Boolean); // filter out undefined

  return (
    <>
      <h2 className="date-heading">{formatDateLabel(date)}</h2>
      {cinema_shortcodes.length > 0 && (
        <p>
          Showing showtimes for:{' '}
          {selectedCinemas.map((cinema) => cinema.name).join(', ')}
        </p>
      )}
      {loadingShowtimes ? (
        <p className="showtime-list-loading">Loading...</p>
      ) : filteredShowtimes.length === 0 ? (
        <p className="showtime-list-empty">{emptyMsg}</p>
      ) : (
        <ul className="showtime-list">
          {filteredShowtimes.map((showtime) => (
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

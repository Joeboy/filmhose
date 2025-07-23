import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShowtimesContext,
  CinemasByShortcodeContext,
  type ShowTime,
} from './Types';
import { toNaiveDateString } from '../toNaiveDateString';
import { formatDateLabel } from '../formatDateLabel';
import ShowTimeItem from './ShowTimeItem';
import { usePageSEO } from '../hooks/usePageSEO';
import { useStructuredData } from '../hooks/useStructuredData';
import './ShowTimeList.css';

const CinemaListings: React.FC = () => {
  const { cinema_shortcode } = useParams<{ cinema_shortcode: string }>();
  const showtimes = useContext(ShowtimesContext);
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);

  const cinema = cinema_shortcode ? cinemasByShortcode[cinema_shortcode] : null;

  // Filter and group showtimes by date for this cinema
  const showtimesByDate = useMemo(() => {
    if (!cinema_shortcode || !showtimes) return {};

    const filteredShowtimes = showtimes.filter(
      (showtime) => showtime.cinema_shortcode === cinema_shortcode,
    );

    const grouped: Record<string, ShowTime[]> = {};

    filteredShowtimes.forEach((showtime) => {
      if (showtime.datetimeObj) {
        const dateString = toNaiveDateString(showtime.datetimeObj.toJSDate());
        if (!grouped[dateString]) {
          grouped[dateString] = [];
        }
        grouped[dateString].push(showtime);
      }
    });

    return grouped;
  }, [cinema_shortcode, showtimes]);

  // Get all showtimes for this cinema for structured data
  const cinemaShowtimes = useMemo(() => {
    if (!cinema_shortcode || !showtimes) return [];
    return showtimes.filter(
      (showtime) => showtime.cinema_shortcode === cinema_shortcode,
    );
  }, [cinema_shortcode, showtimes]);

  // Get sorted dates
  const sortedDates = Object.keys(showtimesByDate).sort();

  // Set page title and structured data
  usePageSEO({ cinemaName: cinema?.name });
  useStructuredData({
    cinema: cinema || undefined,
    showtimes: cinemaShowtimes,
  });

  if (!cinema_shortcode) {
    return <div>No cinema specified</div>;
  }

  if (!cinema) {
    return <div>Cinema not found: {cinema_shortcode}</div>;
  }

  return (
    <div>
      <h1>{cinema.name} Listings</h1>
      <p>
        {cinema.address}, <a href={cinema.url}>{cinema.url}</a>
      </p>

      {sortedDates.length === 0 ? (
        <p className="showtime-list-empty">
          No showtimes found for this {cinema.name}.
        </p>
      ) : (
        <div>
          {sortedDates.map((date) => (
            <div key={date}>
              <p>&nbsp;</p>
              <h2 className="date-heading">
                {formatDateLabel(new Date(date + 'T00:00:00'))}
              </h2>

              <ul className="showtime-list">
                {showtimesByDate[date].map((showtime) => (
                  <li key={showtime.id}>
                    <ShowTimeItem showtime={showtime} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemaListings;

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from './Calendar';
import SearchPanel from './SearchPanel';
import ShowTimeList from './ShowTimeList';
import { toNaiveDateString } from '../toNaiveDateString';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  ShowtimesContext,
  SearchSettingsContext,
  SelectedDateContext,
} from './Types';

const Listings: React.FC = () => {
  const location = useLocation();
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings } = useContext(SearchSettingsContext);
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);

  // Set page title
  usePageTitle({ selectedDate });

  // Set excludeManyShowings based on the route
  const shouldExcludeManyShowings = location.pathname === '/listings';

  const { selectedCinemas } = searchSettings;

  let filteredShowtimes = showtimes;

  // Filter out films with more than 10 showings if this is the /listings route
  if (shouldExcludeManyShowings) {
    const titleCounts: Record<string, number> = {};
    for (const show of filteredShowtimes) {
      titleCounts[show.norm_title] = (titleCounts[show.norm_title] || 0) + 1;
    }
    filteredShowtimes = filteredShowtimes.filter(
      (show) => titleCounts[show.norm_title] <= 10,
    );
  }

  // Filter by selected cinemas from search settings
  filteredShowtimes = filteredShowtimes.filter((show) =>
    selectedCinemas.includes(show.cinema_shortcode),
  );

  // Filter by selected date
  filteredShowtimes = filteredShowtimes.filter(({ datetimeObj }) => {
    if (!datetimeObj) return false;
    const key = toNaiveDateString(datetimeObj.toJSDate());
    return key === selectedDate;
  });

  return (
    <>
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <SearchPanel />
      <ShowTimeList
        showtimes={filteredShowtimes}
        date={new Date(selectedDate)}
      />
    </>
  );
};

export default Listings;

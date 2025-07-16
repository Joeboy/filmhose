import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchPanel from './SearchPanel';
import ShowTimeList from './ShowTimeList';
import { toNaiveDateString } from '../toNaiveDateString';
import {
  ShowtimesContext,
  SearchSettingsContext,
  SelectedDateContext,
} from './Types';

const Listings: React.FC = () => {
  const location = useLocation();
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings, setSearchSettings } = useContext(
    SearchSettingsContext,
  );
  const { selectedDate } = useContext(SelectedDateContext);

  // Set excludeManyShowings based on the route
  const shouldExcludeManyShowings = location.pathname === '/listings';

  useEffect(() => {
    if (searchSettings.excludeManyShowings !== shouldExcludeManyShowings) {
      setSearchSettings({
        ...searchSettings,
        excludeManyShowings: shouldExcludeManyShowings,
      });
    }
  }, [shouldExcludeManyShowings, searchSettings, setSearchSettings]);

  const { selectedCinemas, excludeManyShowings } = searchSettings;

  let filteredShowtimes = showtimes;

  // Filter out films with more than 10 showings if excludeManyShowings is true
  if (excludeManyShowings) {
    const titleCounts: Record<string, number> = {};
    for (const show of filteredShowtimes) {
      titleCounts[show.norm_title] = (titleCounts[show.norm_title] || 0) + 1;
    }
    filteredShowtimes = filteredShowtimes.filter(
      (show) => titleCounts[show.norm_title] <= 10,
    );
  }

  // Filter by selected cinemas if any are selected
  if (selectedCinemas.length > 0) {
    filteredShowtimes = filteredShowtimes.filter((show) =>
      selectedCinemas.includes(show.cinema_shortcode),
    );
  }

  // Filter by selected date
  filteredShowtimes = filteredShowtimes.filter(({ datetimeObj }) => {
    if (!datetimeObj) return false;
    const key = toNaiveDateString(datetimeObj.toJSDate());
    return key === selectedDate;
  });

  return (
    <>
      <SearchPanel />
      <ShowTimeList
        showtimes={filteredShowtimes}
        date={new Date(selectedDate)}
      />
    </>
  );
};

export default Listings;

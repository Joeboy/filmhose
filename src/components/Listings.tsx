import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
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
  const navigate = useNavigate();
  const { cinema_shortcode } = useParams<{ cinema_shortcode?: string }>();
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings, setSearchSettings } = useContext(
    SearchSettingsContext,
  );
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);
  const prevCinemaShortcode = useRef<string | undefined>(undefined);

  // Update search settings when cinema_shortcode changes
  useEffect(() => {
    if (cinema_shortcode && cinema_shortcode !== prevCinemaShortcode.current) {
      setSearchSettings({
        selectedCinemas: [cinema_shortcode],
      });
      prevCinemaShortcode.current = cinema_shortcode;
    }
  }, [cinema_shortcode, setSearchSettings]);

  // Navigate to /listings/ when user changes cinema selection from URL-specified cinema
  useEffect(() => {
    if (
      cinema_shortcode &&
      searchSettings.selectedCinemas.length > 0 && // Only after state has been set
      !(
        searchSettings.selectedCinemas.length === 1 &&
        searchSettings.selectedCinemas.includes(cinema_shortcode)
      )
    ) {
      navigate('/listings/');
    }
  }, [cinema_shortcode, searchSettings.selectedCinemas, navigate]);

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
      <SearchPanel forceOpen={!!cinema_shortcode} />
      <ShowTimeList
        showtimes={filteredShowtimes}
        date={new Date(selectedDate)}
      />
    </>
  );
};

export default Listings;

import React, { useContext } from 'react';
import Calendar from './Calendar';
import type { Cinema } from './Types';
import { CinemasByShortcodeContext } from './Types';

interface SearchPanelProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  excludeManyShowings: boolean;
  setExcludeManyShowings: (value: boolean) => void;
  selectedCinemas: string[]; // array of cinema shortcodes
  setSelectedCinemas: (shortcodes: string[]) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  selectedDate,
  onSelectDate,
  excludeManyShowings,
  setExcludeManyShowings,
  selectedCinemas,
  setSelectedCinemas,
}) => {
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const cinemas: Cinema[] = Object.values(cinemasByShortcode);

  // Handler for toggling a cinema checkbox
  const handleCinemaToggle = (shortcode: string) => {
    if (selectedCinemas.includes(shortcode)) {
      setSelectedCinemas(selectedCinemas.filter((c) => c !== shortcode));
    } else {
      setSelectedCinemas([...selectedCinemas, shortcode]);
    }
  };

  return (
    <div className="search-panel">
      <Calendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div className="search-panel-options">
        {/* <strong>Filter options:</strong> */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={excludeManyShowings}
              onChange={(e) => setExcludeManyShowings(e.target.checked)}
            />{' '}
            Exclude films with a lot of showings
          </label>
        </div>
        <div className="cinema-filter-group">
          <strong>Filter by cinema:</strong>
          <div className="cinema-checkbox-list">
            {cinemas.map((cinema) => (
              <label key={cinema.shortcode}>
                <input
                  type="checkbox"
                  checked={selectedCinemas.includes(cinema.shortcode)}
                  onChange={() => handleCinemaToggle(cinema.shortcode)}
                />{' '}
                {cinema.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;

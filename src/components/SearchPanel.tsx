import React, { useContext } from 'react';
import Calendar from './Calendar';
import type { Cinema } from './Types';
import {
  CinemasByShortcodeContext,
  SearchSettingsContext,
  SelectedDateContext,
} from './Types';

interface SearchPanelProps {}

const SearchPanel: React.FC<SearchPanelProps> = () => {
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);
  const { searchSettings, setSearchSettings } = useContext(
    SearchSettingsContext,
  );
  const cinemas: Cinema[] = Object.values(cinemasByShortcode);

  const { selectedCinemas, excludeManyShowings } = searchSettings;

  // State for showing/hiding options
  const [showOptions, setShowOptions] = React.useState(false);

  // Handler for toggling a cinema checkbox
  const handleCinemaToggle = (shortcode: string) => {
    if (selectedCinemas.includes(shortcode)) {
      setSearchSettings({
        ...searchSettings,
        selectedCinemas: selectedCinemas.filter((c) => c !== shortcode),
      });
    } else {
      setSearchSettings({
        ...searchSettings,
        selectedCinemas: [...selectedCinemas, shortcode],
      });
    }
  };

  const toggleText = showOptions
    ? 'Hide search options'
    : 'Show search options';
  const arrow = showOptions ? '\u25B2' : '\u25BC'; // ▲ or ▼

  return (
    <div className="search-panel">
      <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <div
        className="search-panel-toggle-text"
        onClick={() => setShowOptions((v) => !v)}
        aria-expanded={showOptions}
        tabIndex={0}
        role="button"
        style={{
          margin: '1em 0 0.5em 0',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'inline-block',
          color: '#7b7b7b',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setShowOptions((v) => !v);
        }}
      >
        {toggleText}{' '}
        <span className="search-panel-toggle-arrow" aria-hidden="true">
          {arrow}
        </span>
      </div>
      {showOptions && (
        <div className="search-panel-options">
          <div>
            <label>
              <input
                type="checkbox"
                checked={excludeManyShowings}
                onChange={(e) =>
                  setSearchSettings({
                    ...searchSettings,
                    excludeManyShowings: e.target.checked,
                  })
                }
              />{' '}
              Exclude films with a lot of upcoming showings
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
                  {cinema.shortname}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

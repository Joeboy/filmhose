import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Calendar from './Calendar';
import type { Cinema } from './Types';
import {
  CinemasByShortcodeContext,
  SearchSettingsContext,
  SelectedDateContext,
} from './Types';

interface SearchPanelProps {}

const SearchPanel: React.FC<SearchPanelProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cinemasByShortcode = useContext(CinemasByShortcodeContext);
  const { selectedDate, setSelectedDate } = useContext(SelectedDateContext);
  const { searchSettings, setSearchSettings } = useContext(
    SearchSettingsContext,
  );
  const cinemas: Cinema[] = Object.values(cinemasByShortcode);

  // Sort cinemas alphabetically by shortname
  const sortedCinemas = cinemas.sort((a, b) =>
    a.shortname.localeCompare(b.shortname),
  );

  const { selectedCinemas } = searchSettings;

  // Determine current excludeManyShowings state based on route
  const excludeManyShowings = location.pathname === '/listings';

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

  const handleSelectAll = () => {
    const allCinemaShortcodes = sortedCinemas.map((cinema) => cinema.shortcode);
    setSearchSettings({
      ...searchSettings,
      selectedCinemas: allCinemaShortcodes,
    });
  };

  const handleSelectNone = () => {
    setSearchSettings({
      ...searchSettings,
      selectedCinemas: [],
    });
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
                onChange={(e) => {
                  // Navigate to appropriate route based on checkbox state
                  if (e.target.checked) {
                    navigate('/listings');
                  } else {
                    navigate('/hosepipe');
                  }
                }}
              />{' '}
              Exclude films with a lot of upcoming showings
            </label>
          </div>
          <div className="cinema-filter-group">
            <strong>Filter by cinema:</strong>

            <div className="cinema-checkbox-list">
              {sortedCinemas.map((cinema) => (
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
            <div className="cinema-selection-buttons">
              <button
                type="button"
                onClick={handleSelectAll}
                className="cinema-selection-button"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleSelectNone}
                className="cinema-selection-button"
              >
                Select None
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

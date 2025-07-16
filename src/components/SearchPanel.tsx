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

  // Sort cinemas alphabetically by shortname
  const sortedCinemas = cinemas.sort((a, b) =>
    a.shortname.localeCompare(b.shortname),
  );

  const { selectedCinemas } = searchSettings;

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

  const handleSaveCinemaSettings = () => {
    const confirmed = window.confirm(
      'Do you want to save your cinema selection? ' +
        'This will set a cookie on your device, which will only be used ' +
        'to store your preferences for future visits.',
    );

    if (confirmed) {
      const selectedCinemaString = selectedCinemas.join('');
      const cookieData = JSON.stringify({ cinemas: selectedCinemaString });
      // Set cookie with 1 year expiration
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      document.cookie = `selectedCinemas=${encodeURIComponent(cookieData)}; expires=${expirationDate.toUTCString()}; path=/`;

      alert('Cinema settings saved successfully!');
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
              <button
                type="button"
                onClick={handleSaveCinemaSettings}
                className="cinema-selection-button"
                style={{
                  backgroundColor: '#e3f2fd',
                  borderColor: '#1976d2',
                  color: '#1976d2',
                }}
              >
                Save Cinema Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

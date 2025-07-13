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

  // State for showing/hiding options
  const [showOptions, setShowOptions] = React.useState(false);

  // Handler for toggling a cinema checkbox
  const handleCinemaToggle = (shortcode: string) => {
    if (selectedCinemas.includes(shortcode)) {
      setSelectedCinemas(selectedCinemas.filter((c) => c !== shortcode));
    } else {
      setSelectedCinemas([...selectedCinemas, shortcode]);
    }
  };

  const toggleText = showOptions
    ? 'Hide search options'
    : 'Show search options';
  const arrow = showOptions ? '\u25B2' : '\u25BC'; // ▲ or ▼

  return (
    <div className="search-panel">
      <Calendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
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

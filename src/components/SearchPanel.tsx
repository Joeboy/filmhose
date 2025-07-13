import React from 'react';
import Calendar from './Calendar';

interface SearchPanelProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  excludeManyShowings: boolean;
  setExcludeManyShowings: (value: boolean) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  selectedDate,
  onSelectDate,
  excludeManyShowings,
  setExcludeManyShowings,
}) => {

  return (
    <div className="search-panel">
      <Calendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      <div style={{ marginTop: '1em' }}>
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
      </div>
    </div>
  );
};

export default SearchPanel;

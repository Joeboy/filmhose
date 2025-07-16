import React, { useState, useMemo, useContext } from 'react';
import SearchPanel from './SearchPanel';
import {
  type ShowTime,
  ShowtimesContext,
  SearchSettingsContext,
} from './Types';

const Titles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTitles, setExpandedTitles] = useState<Set<string>>(new Set());

  // Get data from contexts
  const showtimes = useContext(ShowtimesContext);
  const { searchSettings } = useContext(SearchSettingsContext);

  // Apply filters to showtimes
  const filteredShowtimes = useMemo(() => {
    // Safety check: return empty array if showtimes is not loaded yet
    if (!showtimes || showtimes.length === 0) {
      return [];
    }

    let filtered = showtimes;

    // Filter by selected cinemas
    filtered = filtered.filter((show) =>
      searchSettings.selectedCinemas.includes(show.cinema_shortcode),
    );

    return filtered;
  }, [showtimes, searchSettings]);

  // Group filtered showtimes by title and filter by search term
  const groupedTitles = useMemo(() => {
    const groups: Record<string, ShowTime[]> = {};

    filteredShowtimes.forEach((showtime) => {
      const title = showtime.title;
      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(showtime);
    });

    // Sort showtimes within each group by datetime
    Object.keys(groups).forEach((title) => {
      groups[title].sort((a, b) => {
        const aTime = a.datetimeObj?.toMillis() || 0;
        const bTime = b.datetimeObj?.toMillis() || 0;
        return aTime - bTime;
      });
    });

    // Filter by search term and sort titles by norm_title + title concatenation
    const filteredTitles = Object.keys(groups)
      .filter((title) => title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        // Get a representative showtime from each group to access norm_title
        const aShowtime = groups[a][0];
        const bShowtime = groups[b][0];
        const aSortKey = (aShowtime.norm_title || '') + aShowtime.title;
        const bSortKey = (bShowtime.norm_title || '') + bShowtime.title;
        return aSortKey.localeCompare(bSortKey);
      });

    return filteredTitles.map((title) => ({
      title,
      showtimes: groups[title],
    }));
  }, [filteredShowtimes, searchTerm]);

  const toggleTitle = (title: string) => {
    const newExpanded = new Set(expandedTitles);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedTitles(newExpanded);
  };

  return (
    <div>
      <h1>Film Titles</h1>

      {/* Search Panel */}
      <SearchPanel />

      {/* Title search box */}
      <div style={{ marginBottom: '2em' }}>
        <input
          type="text"
          placeholder="Search titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5em',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Results count */}
      <p style={{ marginBottom: '1em', color: '#666' }}>
        {groupedTitles.length} title{groupedTitles.length !== 1 ? 's' : ''}{' '}
        found
      </p>

      {/* Titles list */}
      <div>
        {groupedTitles.map(({ title, showtimes: titleShowtimes }) => {
          const isExpanded = expandedTitles.has(title);
          const arrow = isExpanded ? '▼' : '▶';

          return (
            <div
              key={title}
              style={{
                marginBottom: '1em',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              {/* Title header */}
              <div
                onClick={() => toggleTitle(title)}
                style={{
                  padding: '1em',
                  cursor: 'pointer',
                  background: '#f9f9f9',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                }}
              >
                <div>
                  <span style={{ marginRight: '0.5em', fontSize: '1.1em' }}>
                    {arrow}
                  </span>
                  <strong>{title}</strong>
                  <span
                    style={{
                      marginLeft: '0.5em',
                      color: '#666',
                      fontSize: '0.9em',
                    }}
                  >
                    ({titleShowtimes.length} showing
                    {titleShowtimes.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {/* Expanded showtimes */}
              {isExpanded && (
                <div style={{ padding: '1em' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {titleShowtimes.map((showtime: ShowTime, index: number) => (
                      <li
                        key={`${showtime.cinema_shortcode}-${showtime.datetime}-${index}`}
                        style={{ marginBottom: '0.5em' }}
                      >
                        <a
                          href={showtime.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {showtime.datetimeObj?.toFormat('EEE d MMM') ||
                            'Date unavailable'}{' '}
                          {showtime.datetimeObj
                            ?.toFormat('h:mm a')
                            .padStart(8, '\u00A0') || 'Time unavailable'}{' '}
                          · {showtime.cinema?.name || 'Cinema unavailable'}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {groupedTitles.length === 0 && searchTerm && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2em' }}>
          No titles found matching "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default Titles;

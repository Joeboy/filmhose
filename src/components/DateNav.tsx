import './DateNav.css';
import type { FC, Dispatch, SetStateAction } from 'react';

export type WeekRange = 'this' | 'next';

interface DateNavProps {
  weekRange: WeekRange;
  setWeekRange: Dispatch<SetStateAction<WeekRange>>;
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  formatDateLabel: (date: Date) => string;
}

const getDateRange = (range: WeekRange): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  const base = new Date(today);

  if (range === 'next') {
    base.setDate(base.getDate() + 7);
  }

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(new Date(d));
  }

  return dates;
};

export const DateNav: FC<DateNavProps> = ({
  weekRange,
  setWeekRange,
  selectedDate,
  setSelectedDate,
  formatDateLabel,
}) => {
  const ranges: { key: WeekRange; label: string }[] = [
    { key: 'this', label: 'This week' },
    { key: 'next', label: 'Next week' },
  ];

  const currentRangeDates = getDateRange(weekRange);

  return (
    <div className="date-nav">
      <div className="date-nav-range">
        {ranges.map(({ key, label }) => (
          <button
            className="date-nav-button"
            key={key}
            onClick={() => setWeekRange(key)}
            style={{
              fontWeight: weekRange === key ? 'bold' : 'normal',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="date-nav-days">
        {currentRangeDates.map((date) => {
          const key = date.toISOString().split('T')[0];
          return (
            <button
              className="date-nav-button"
              key={key}
              onClick={() => setSelectedDate(key)}
              style={{
                fontWeight: selectedDate === key ? 'bold' : 'normal',
              }}
            >
              {formatDateLabel(date)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

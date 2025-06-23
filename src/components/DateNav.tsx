import './DateNav.css';
import type { FC, Dispatch, SetStateAction } from 'react';

interface DateNavProps {
  weekRange: 'this' | 'next';
  setWeekRange: Dispatch<SetStateAction<'this' | 'next'>>;
  selectedDate: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  formatDateLabel: (date: Date) => string;
}

const getDateRange = (range: 'this' | 'next'): Date[] => {
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

const DateNav: FC<DateNavProps> = ({
  weekRange,
  setWeekRange,
  selectedDate,
  setSelectedDate,
  formatDateLabel,
}) => {
  const ranges: { key: 'this' | 'next'; label: string }[] = [
    { key: 'this', label: 'This week' },
    { key: 'next', label: 'Next week' },
  ];

  const currentRangeDates = getDateRange(weekRange);

  return (
    <div className='date-nav'>
      <div>
        {ranges.map(({ key, label }) => (
          <button
            className="date-nav-button"
            key={key}
            onClick={() => {
              setWeekRange(key);
              const newDate = getDateRange(key)[0];
              setSelectedDate(newDate.toISOString().split('T')[0]);
            }}
            style={{
              fontWeight: weekRange === key ? 'bold' : 'normal',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {currentRangeDates.map((date) => {
          const key = date.toISOString().split('T')[0];
          return (
            <button className='date-nav-button'
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

export default DateNav;

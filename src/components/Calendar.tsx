import React from 'react';
import CalendarWidget from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toNaiveDateString } from '../toNaiveDateString';

interface CalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  // Convert selectedDate string to Date object
  const value = selectedDate ? new Date(selectedDate) : new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  return (
    <div className="calendar-widget">
      <CalendarWidget
        value={value}
        onChange={(date) => {
          // react-calendar can return Date or Date[]
          const d = Array.isArray(date) ? date[0] : date;
          if (d) {
            onSelectDate(toNaiveDateString(d));
          }
        }}
        tileDisabled={({ date }) => date < today}
      />
    </div>
  );
};

export default Calendar;

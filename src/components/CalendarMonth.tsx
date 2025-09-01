// src/components/CalendarMonth.tsx
import React from 'react';
import { format, isToday } from 'date-fns';
import { useCalendar } from '../hooks/useCalendar';
import JournalCard from './JournalCard';
import type { JournalEntry } from '../types';

interface CalendarMonthProps {
  monthDate: Date;
  journalEntries: Map<string, JournalEntry>;
  onDayClick: (entry: JournalEntry) => void;
}

const CalendarMonth = React.forwardRef<HTMLDivElement, CalendarMonthProps>(
  ({ monthDate, journalEntries, onDayClick }, ref) => {
    const { weekHeaders, days } = useCalendar(monthDate);

    return (
      <section ref={ref} data-month={format(monthDate, 'yyyy-MM')} className="flex flex-col mb-4 px-2">
        <h2 className="text-xl font-bold text-center my-4 md:hidden">
          {format(monthDate, 'MMMM yyyy')}
        </h2>
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 pb-2">
          {weekHeaders.map((day, index) => <div key={index}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-grow">
          {days.map(({ date, isCurrentMonth, key }) => {
            const entry = journalEntries.get(key);
            const isCurrentDay = isToday(date);
            return (
              <div
                key={key}
                className={`relative h-24 md:h-32 lg:h-40 p-1 border border-gray-100 rounded-md transition-colors
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${!isCurrentMonth ? 'text-gray-300' : ''}`}
              >
                <span className={`text-xs md:text-sm font-medium
                  ${isCurrentDay ? 'bg-blue-500 text-white rounded-full flex items-center justify-center w-6 h-6' : ''}`}>
                  {format(date, 'd')}
                </span>
                {entry && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <JournalCard entry={entry} onClick={() => onDayClick(entry)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
);

export default CalendarMonth;
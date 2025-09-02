
import React, { useRef, useCallback, useEffect } from 'react';
import { format, isToday, isFirstDayOfMonth, getDay, parse } from 'date-fns';
import { useInfiniteDays } from '../hooks/useInfiniteDays';
import JournalCard from './JournalCard';
import type { JournalEntry } from '../types';

interface InfiniteCalendarProps {
  journalEntries: Map<string, JournalEntry>;
  onDayClick: (entry: JournalEntry) => void;
  setCurrentMonthForHeader: (date: Date) => void;
}

// A memoized Day Cell component with the new date rendering logic
const DayCell: React.FC<{ day: any, entry?: JournalEntry, onDayClick: (entry: JournalEntry) => void, monthRefCallback: (node: HTMLDivElement | null) => void }> = React.memo(({ day, entry, onDayClick, monthRefCallback }) => {
  const isCurrentDay = isToday(day.date);
  const isFirst = isFirstDayOfMonth(day.date);

  const renderDate = () => {
    if (isFirst) {
      return (
        // Use flexbox to align the month and the circled number
        <div className="flex items-center gap-1">
          <span className="text-gray-700 flex items-center justify-center text-sm">
            {format(day.date, 'd')}
          </span>
          <span className="text-sm text-gray-700">
            {format(day.date, 'MMM')}
          </span>
        </div>
      );
    }
    // Priority 2: Today (but not the first of the month)
    if (isCurrentDay) {
      return (
        <span className="bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {format(day.date, 'd')}
        </span>
      );
    }

    return (
      <span className="text-gray-700 text-sm">
        {format(day.date, 'd')}
      </span>
    );
  };

  return (
    <div
      ref={isFirst ? monthRefCallback : null}
      data-month-year={format(day.date, 'MMM yyyy')}
      className="relative p-1 border-b border-r border-gray-200 bg-white min-h-[120px] flex flex-col items-center"
    >
      {/* Month/Year display for the first column */}
      {getDay(day.date) === 0 && isFirst && (
        <div className="absolute -left-14 top-1 w-12 text-right">
          <h3 className="font-bold text-gray-800">{format(day.date, 'MMM')}</h3>
          <p className="text-sm text-gray-500">{format(day.date, 'yyyy')}</p>
        </div>
      )}

      {/* Date Number at the top */}
      <div className="h-6 mb-1">{renderDate()}</div>

      {/* Journal Card fills the rest */}
      {entry && (
        <div className="w-full flex-grow">
          <JournalCard entry={entry} onClick={() => onDayClick(entry)} />
        </div>
      )}
    </div>
  );
});


const InfiniteCalendar: React.FC<InfiniteCalendarProps> = ({ journalEntries, onDayClick, setCurrentMonthForHeader }) => {
  const { days, loadMorePast, loadMoreFuture } = useInfiniteDays(new Date());

  const observer = useRef<IntersectionObserver | null>(null);
  const monthHeaderObserver = useRef<IntersectionObserver | null>(null);
  const weekHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Observer for infinite scrolling
  const topObserverRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMorePast();
    });
    if (node) observer.current.observe(node);
  }, [loadMorePast]);

  const bottomObserverRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMoreFuture();
    });
    if (node) observer.current.observe(node);
  }, [loadMoreFuture]);

  // Observer for updating the main header
  useEffect(() => {
    if (monthHeaderObserver.current) monthHeaderObserver.current.disconnect();

    monthHeaderObserver.current = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          const monthYearString = (intersectingEntry.target as HTMLElement).dataset.monthYear;
          if (monthYearString) {
            const date = parse(monthYearString, 'MMM yyyy', new Date());
            setCurrentMonthForHeader(date);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );


    const currentObserver = monthHeaderObserver.current;
    document.querySelectorAll('[data-month-year]').forEach(el => {
      if ((el as HTMLElement).dataset.monthYear) {
        currentObserver.observe(el);
      }
    });

    return () => currentObserver.disconnect();
  }, [days, setCurrentMonthForHeader]);

  const monthRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node && monthHeaderObserver.current) {
      monthHeaderObserver.current.observe(node);
    }
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div ref={topObserverRef} className="h-1" />
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-0 z-10 grid grid-cols-7 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          {weekHeaders.map((day, index) => (
            <div key={index} className="text-center text-sm font-bold text-gray-800 py-3">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map(day => (
            <DayCell
              key={day.key}
              day={day}
              entry={journalEntries.get(day.key)}
              onDayClick={onDayClick}
              monthRefCallback={monthRefCallback}
            />
          ))}
        </div>
      </div>
      <div ref={bottomObserverRef} className="h-1" />
    </div>
  );
};

export default InfiniteCalendar;
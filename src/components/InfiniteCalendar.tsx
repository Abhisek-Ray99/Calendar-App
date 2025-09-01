// src/components/InfiniteCalendar.tsx
import React, { useRef, useCallback, useEffect } from 'react';
import { format, isToday, isFirstDayOfMonth } from 'date-fns';
import { useInfiniteDays } from '../hooks/useInfiniteDays';
import JournalCard from './JournalCard';
import type { JournalEntry } from '../types';

interface InfiniteCalendarProps {
  journalEntries: Map<string, JournalEntry>;
  onDayClick: (entry: JournalEntry) => void;
  setCurrentMonthForHeader: (month: string) => void;
}

// A memoized Day Cell component with the new date rendering logic
const DayCell: React.FC<{ day: any, entry?: JournalEntry, onDayClick: (entry: JournalEntry) => void, monthRefCallback: (node: HTMLDivElement | null) => void }> = React.memo(({ day, entry, onDayClick, monthRefCallback }) => {
  const isCurrentDay = isToday(day.date);
  const isFirst = isFirstDayOfMonth(day.date);

  // --- NEW: Conditional Rendering for the Date ---
  const renderDate = () => {
    // State 1: First day of any month
    if (isFirst) {
      return (
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-sm text-gray-800">
            {format(day.date, 'MMM')}
          </span>
          <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
            {format(day.date, 'd')}
          </span>
        </div>
      );
    }
    // State 2: Today's date (but not the first of the month)
    if (isCurrentDay) {
      return (
        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
          {format(day.date, 'd')}
        </span>
      );
    }
    // State 3: A regular day
    return (
      <span className="text-gray-700 text-sm font-medium">
        {format(day.date, 'd')}
      </span>
    );
  };

  return (
    <div
      ref={isFirst ? monthRefCallback : null}
      data-month-year={format(day.date, 'MMMM yyyy')}
      className="relative h-28 md:h-36 lg:h-44 p-1.5 border-b border-r border-gray-100 bg-white"
    >
      <div className="h-6"> {/* Container to prevent layout shift */}
        {renderDate()}
      </div>
      {entry && (
        <div className="absolute bottom-1.5 left-1.5 right-1.5">
          <JournalCard entry={entry} onClick={() => onDayClick(entry)} />
        </div>
      )}
    </div>
  );
});


const InfiniteCalendar: React.FC<InfiniteCalendarProps> = ({ journalEntries, onDayClick, setCurrentMonthForHeader }) => {
  const { days, weekHeaders, loadMorePast, loadMoreFuture } = useInfiniteDays(new Date());

  const observer = useRef<IntersectionObserver | null>(null);
  const monthHeaderObserver = useRef<IntersectionObserver | null>(null);

  // Observer for infinite scrolling
  const topObserverRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMorePast();
    });
    if (node) observer.current.observe(node);
  }, [loadMorePast]);

  const bottomObserverRef = useCallback(node => {
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
          const monthYear = (intersectingEntry.target as HTMLElement).dataset.monthYear;
          if (monthYear) {
            setCurrentMonthForHeader(monthYear);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    
    const currentObserver = monthHeaderObserver.current;
    document.querySelectorAll('[data-month-year]').forEach(el => {
        if((el as HTMLElement).dataset.monthYear) {
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
        <div className="sticky top-0 z-10 grid grid-cols-7 bg-white/80 backdrop-blur-sm shadow-sm">
          {weekHeaders.map((day, index) => (
            <div key={index} className="text-center text-sm font-semibold text-gray-500 py-3 border-b">
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
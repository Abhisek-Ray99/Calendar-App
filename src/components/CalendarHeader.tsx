// src/components/CalendarHeader.tsx
import React from 'react';

interface CalendarHeaderProps {
  currentMonth: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm p-4">
      <div className="relative max-w-7xl mx-auto flex justify-between items-center">
        <div className="absolute left-0 flex items-center space-x-4">
          <button className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">my hair diary</h1>
        </div>
        <div className="flex-grow text-center">
          <h2 className="text-xl font-semibold text-blue-600">{currentMonth}</h2>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;

import React from 'react';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

interface CalendarHeaderProps {
  // We now expect a Date object, which is more flexible.
  currentDate: Date;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate }) => {
  // Format the date into separate month and year parts inside the component.
  const currentMonth = format(currentDate, 'MMMM');
  const currentYear = format(currentDate, 'yyyy');

  return (
    <header className="sticky top-0 z-20 bg-white p-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side: Back Arrow & Title */}
        <div className='flex items-center space-x-4'>
          <button className="text-black">
            <ArrowLeft size={24} strokeWidth={2} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            <span className="text-[#5bb9e5]">my</span> hair diary
          </h1>
        </div>

        {/* Right side: Dynamic Month/Year */}
        <div className="text-right">
          <h2 className="text-lg text-gray-700">
            <span className="font-bold">{currentMonth}</span>{" "}
            <span className="font-normal">{currentYear}</span>
          </h2>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
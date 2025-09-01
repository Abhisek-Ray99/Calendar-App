// src/App.tsx
// This file remains exactly the same as the last version.
// It correctly handles the state for `selectedEntryIndex`.
import React, { useState, useMemo } from 'react';
import CalendarHeader from './components/CalendarHeader';
import InfiniteCalendar from './components/InfiniteCalendar';
import { JournalCarousel } from './components/JournalCarousel';
import { journalEntries } from './data/journalData';
import { groupEntriesByDate } from './utils/dataUtils';
import { format } from 'date-fns';
import type { JournalEntry } from './types';
import { PlusIcon } from 'lucide-react';

function App() {
  const [currentMonthForHeader, setCurrentMonthForHeader] = useState<string>(format(new Date(), 'MMMM yyyy'));
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);

  const entriesByDate = useMemo(() => groupEntriesByDate(journalEntries), []);
  
  const sortedEntries = useMemo(() => 
    [...journalEntries].sort((a, b) => 
      new Date(a.date.split('/').reverse().join('-')).getTime() - 
      new Date(b.date.split('/').reverse().join('-')).getTime()
    ), []);

  const handleDayClick = (entry: JournalEntry) => {
    const index = sortedEntries.findIndex(e => e.date === entry.date);
    if (index !== -1) {
      setSelectedEntryIndex(index);
    }
  };
  
  const handleCloseCarousel = () => {
    setSelectedEntryIndex(null);
  };
  
  return (
    <div className="h-screen w-screen bg-gray-50 font-sans flex flex-col">
      <CalendarHeader currentMonth={currentMonthForHeader} />
      <main className="flex-grow overflow-hidden">
        <InfiniteCalendar 
            journalEntries={entriesByDate}
            onDayClick={handleDayClick}
            setCurrentMonthForHeader={setCurrentMonthForHeader}
        />
      </main>
      <div className="fixed bottom-8 right-8 z-20">
        <button className="bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg text-3xl font-light p-4">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      
      {selectedEntryIndex !== null && (
        <JournalCarousel
          entries={sortedEntries}
          selectedIndex={selectedEntryIndex}
          onClose={handleCloseCarousel}
          onSelectedIndexChange={setSelectedEntryIndex}
        />
      )}
    </div>
  );
}

export default App;
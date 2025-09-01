// src/App.tsx
import { useState, useMemo } from 'react';
import CalendarHeader from './components/CalendarHeader';
import InfiniteCalendar from './components/InfiniteCalendar';
import { JournalCarousel } from './components/JournalCarousel';
import { LoadingSpinner } from './components/LoadingSpinner'; // Assuming you create this
import { groupEntriesByDate } from './utils/dataUtils';
import { format } from 'date-fns';
import type { JournalEntry } from './types';
import { PlusIcon } from 'lucide-react'; // npm install lucide-react
import { useEventStore } from './stores/use-event-store';
import { EventFormModal } from './modals/EventFormModal';

function App() {
  // --- State from our new global store ---
  const { entries, addEntry, updateEntry } = useEventStore();

  // --- Local UI State ---
  const [currentMonthForHeader, setCurrentMonthForHeader] = useState<string>(format(new Date(), 'MMMM yyyy'));
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Memoized computations based on global state ---
  const entriesByDate = useMemo(() => groupEntriesByDate(entries), [entries]);
  const sortedEntries = useMemo(() =>
    [...entries].sort((a, b) =>
      new Date(a.date.split('/').reverse().join('-')).getTime() -
      new Date(b.date.split('/').reverse().join('-')).getTime()
    ), [entries]);

  // --- Handlers ---
  const handleDayClick = (entry: JournalEntry) => {
    const index = sortedEntries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      setSelectedEntryIndex(index);
    }
  };

  const handleCloseCarousel = () => {
    setSelectedEntryIndex(null);
  };

  const handleOpenForm = (entry?: JournalEntry) => {
    setEditingEntry(entry || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleSubmitEntry = (entryData: Omit<JournalEntry, 'id'>, id?: string) => {
    setIsLoading(true);
    // Simulate async operation
    setTimeout(() => {
      if (id) {
        // Update existing entry
        updateEntry({ ...entryData, id });
      } else {
        // Add new entry with a unique ID
        addEntry({ ...entryData, id: `entry-${new Date().getTime()}` });
      }
      setIsLoading(false);
      handleCloseForm();
    }, 500); // Simulate network delay
  };

  return (
    <div className="h-screen w-screen bg-gray-50 font-sans flex flex-col">
      {isLoading && <LoadingSpinner />}
      <CalendarHeader currentMonth={currentMonthForHeader} />

      <main className="flex-grow overflow-hidden">
        <InfiniteCalendar
          journalEntries={entriesByDate}
          onDayClick={handleDayClick}
          setCurrentMonthForHeader={setCurrentMonthForHeader}
        />
      </main>

      <div className="fixed bottom-8 right-8 z-20">
        <button
          onClick={() => handleOpenForm()}
          className="bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg p-4 hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      
      {selectedEntryIndex !== null && (
        <JournalCarousel
          entries={sortedEntries}
          selectedIndex={selectedEntryIndex}
          onClose={handleCloseCarousel}
          onSelectedIndexChange={setSelectedEntryIndex}
          onOpenEditForm={handleOpenForm}
        />
      )}

      <EventFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitEntry}
        initialData={editingEntry}
      />
    </div>
  );
}

export default App;
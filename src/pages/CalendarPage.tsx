
import { useState, useMemo } from 'react';
import CalendarHeader from '../components/CalendarHeader';
import InfiniteCalendar from '../components/InfiniteCalendar';
import { JournalCarousel } from '../components/JournalCarousel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { groupEntriesByDate } from '../utils/dataUtils';
import type { JournalEntry } from '../types';
import { PlusIcon } from 'lucide-react';
import { useEventStore } from '../stores/use-event-store';
import { EventFormModal } from '../modals/EventFormModal';

export const CalendarPage = () => {
  
  const { entries, addEntry, updateEntry } = useEventStore();
  const [currentDateForHeader, setCurrentDateForHeader] = useState<Date>(new Date());
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const entriesByDate = useMemo(() => groupEntriesByDate(entries), [entries]);
  const sortedEntries = useMemo(() =>
    [...entries].sort((a, b) =>
      new Date(a.date.split('/').reverse().join('-')).getTime() -
      new Date(b.date.split('/').reverse().join('-')).getTime()
    ), [entries]);

  const handleDayClick = (entry: JournalEntry) => {
    const index = sortedEntries.findIndex(e => e.id === entry.id);
    if (index !== -1) setSelectedEntryIndex(index);
  };

  const handleCloseCarousel = () => setSelectedEntryIndex(null);
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
    setTimeout(() => {
      if (id) {
        updateEntry({ ...entryData, id });
      } else {
        addEntry({ ...entryData, id: `entry-${new Date().getTime()}` });
      }
      setIsLoading(false);
      handleCloseForm();
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {isLoading && <LoadingSpinner />}
      <CalendarHeader currentDate={currentDateForHeader} />

      <div className="flex-grow overflow-hidden relative">
        <InfiniteCalendar
          journalEntries={entriesByDate}
          onDayClick={handleDayClick}
          setCurrentMonthForHeader={setCurrentDateForHeader}
        />
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => handleOpenForm()}
            className="bg-[#5bb9e5] text-white rounded-full flex items-center justify-center shadow-lg w-16 h-16"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>
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
};
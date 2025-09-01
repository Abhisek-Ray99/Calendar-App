
import { createContext, useReducer, useContext, type ReactNode } from 'react';
import { journalEntries as initialMockData } from '../data/journalData';
import type { JournalEntry } from '../types';

// --- Types ---
type EventAction =
  | { type: 'ADD'; payload: JournalEntry }
  | { type: 'UPDATE'; payload: JournalEntry }
  | { type: 'DELETE'; payload: { id: string } };

interface EventState {
  entries: JournalEntry[];
}

interface EventContextProps extends EventState {
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
}

// --- Reducer ---
const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'ADD':
      return { ...state, entries: [...state.entries, action.payload] };
    case 'UPDATE':
      return {
        ...state,
        entries: state.entries.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE':
      return {
        ...state,
        entries: state.entries.filter(e => e.id !== action.payload.id),
      };
    default:
      return state;
  }
};

// --- Context ---
const EventStoreContext = createContext<EventContextProps | undefined>(undefined);

// --- Provider ---
export const EventStoreProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with mock data (adds unique IDs)
  const [state, dispatch] = useReducer(eventReducer, {
    entries: initialMockData.map((entry, index) => ({
      ...entry,
      id: `mock-${index}-${Date.now()}`
    })),
  });

  const addEntry = (entry: JournalEntry) =>
    dispatch({ type: 'ADD', payload: entry });

  const updateEntry = (entry: JournalEntry) =>
    dispatch({ type: 'UPDATE', payload: entry });

  const deleteEntry = (id: string) =>
    dispatch({ type: 'DELETE', payload: { id } });

  return (
    <EventStoreContext.Provider
      value={{ ...state, addEntry, updateEntry, deleteEntry }}
    >
      {children}
    </EventStoreContext.Provider>
  );
};

// --- Custom Hook ---
export const useEventStore = () => {
  const context = useContext(EventStoreContext);
  if (context === undefined) {
    throw new Error('useEventStore must be used within an EventStoreProvider');
  }
  return context;
};

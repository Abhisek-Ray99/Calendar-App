
import { parse } from 'date-fns';
import type { JournalEntry } from '../types';


export const groupEntriesByDate = (entries: JournalEntry[]): Map<string, JournalEntry> => {
  const entryMap = new Map<string, JournalEntry>();
  entries.forEach(entry => {
    const date = parse(entry.date, 'dd/MM/yyyy', new Date());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    entryMap.set(key, entry);
  });
  return entryMap;
};
// src/utils/dataUtils.ts
import { parse } from 'date-fns';
import type { JournalEntry } from '../types';

/**
 * Parses and groups journal entries by date for efficient lookup.
 * @param {JournalEntry[]} entries - The array of journal entries.
 * @returns {Map<string, JournalEntry>} A map where keys are 'yyyy-MM-dd' and values are the entry.
 */
export const groupEntriesByDate = (entries: JournalEntry[]): Map<string, JournalEntry> => {
  const entryMap = new Map<string, JournalEntry>();
  entries.forEach(entry => {
    const date = parse(entry.date, 'dd/MM/yyyy', new Date());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    entryMap.set(key, entry);
  });
  return entryMap;
};
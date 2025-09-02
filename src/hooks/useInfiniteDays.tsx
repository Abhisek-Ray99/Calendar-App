
import { useState, useMemo, useCallback } from 'react';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';
import type { CalendarDay } from '../types';

const WEEK_STARTS_ON = 0; // 0 for Sunday

/**
 * Manages a continuous, infinite list of days for the calendar grid.
 */
export const useInfiniteDays = (initialMonth: Date) => {
  const [monthRange, setMonthRange] = useState({
    start: subMonths(initialMonth, 1),
    end: addMonths(initialMonth, 1),
  });

  const days: CalendarDay[] = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(monthRange.start), { weekStartsOn: WEEK_STARTS_ON });
    const endDate = endOfWeek(endOfMonth(monthRange.end), { weekStartsOn: WEEK_STARTS_ON });

    const dayArray = eachDayOfInterval({ start: startDate, end: endDate });

    return dayArray.map(date => ({
      date,
      isCurrentMonth: date.getMonth() === monthRange.start.getMonth() || date.getMonth() === monthRange.end.getMonth(), 
      key: format(date, 'yyyy-MM-dd'),
    }));
  }, [monthRange]);

  const loadMorePast = useCallback(() => {
    setMonthRange(prev => ({ ...prev, start: subMonths(prev.start, 1) }));
  }, []);

  const loadMoreFuture = useCallback(() => {
    setMonthRange(prev => ({ ...prev, end: addMonths(prev.end, 1) }));
  }, []);

  // Get the headers just once
  const weekHeaders = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });
    return eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: WEEK_STARTS_ON }) })
      .map(day => format(day, 'E')); // S, M, T, W, T, F, S
  }, []);


  return { days, weekHeaders, loadMorePast, loadMoreFuture };
};
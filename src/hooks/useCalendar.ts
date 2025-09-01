
import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';
import type { CalendarDay } from '../types';

const WEEK_STARTS_ON = 0; // 0 for Sunday

interface UseCalendarReturn {
  weekHeaders: string[];
  days: CalendarDay[];
}


export const useCalendar = (monthDate: Date): UseCalendarReturn => {
  const calendarData = useMemo(() => {
    const firstDayOfMonth = startOfMonth(monthDate);
    const lastDayOfMonth = endOfMonth(monthDate);

    const daysInMonth = eachDayOfInterval({
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: WEEK_STARTS_ON }),
      end: endOfWeek(lastDayOfMonth, { weekStartsOn: WEEK_STARTS_ON }),
    });

    const calendarDays: CalendarDay[] = daysInMonth.map(date => ({
      date,
      isCurrentMonth: date.getMonth() === monthDate.getMonth(),
      key: format(date, 'yyyy-MM-dd'),
    }));

    const weekHeaders = eachDayOfInterval({
      start: startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON }),
      end: endOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON }),
    }).map(day => format(day, 'E').charAt(0));

    return { weekHeaders, days: calendarDays };
  }, [monthDate]);

  return calendarData;
};
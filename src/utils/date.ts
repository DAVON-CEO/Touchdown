import { format, parseISO, isAfter, compareAsc } from 'date-fns';
import { Trip } from '../data/models';

export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

export function formatDate(dateString: string, pattern = 'yyyy-MM-dd'): string {
  return format(parseISO(dateString), pattern);
}

export function getUpcomingTrip(trips: Trip[]): Trip | undefined {
  const now = new Date();
  // Filter trips starting after now
  const upcoming = trips.filter(t => isAfter(parseISO(t.endDate), now));
  // Sort by start date
  upcoming.sort((a, b) => compareAsc(parseISO(a.startDate), parseISO(b.startDate)));
  return upcoming[0];
}
import { granularityToDateTimeUnit, Granularity } from './granularity';
import { Day, Person } from '../data/days';
import { DateTime } from 'luxon';

export function selectDays(days: Day[], startDate: string, endDate: string, people: Person[]): Day[] {
  return days.filter(day => day.date >= startDate && day.date <= endDate)
    .map(day => ({
      ...day,
      people: day.people.filter(person => people.length === 0 || people.includes(person)),
      closePeople: day.closePeople.filter(person => people.length === 0 || people.includes(person)),
    }));
}

export function countPosts(days: Day[], people: Person[]) {
  const counts = Object.fromEntries(people.map(person => [person, { exact: 0, close: 0 }])) as Record<Person, { exact: number; close: number }>;
  for (const day of days) {
    for (const person of day.people) if (counts[person]) counts[person].exact++;
    for (const person of day.closePeople) if (counts[person]) counts[person].close++;
  }
  return counts;
}

export function groupContributions(days: Day[], granularity: Granularity) {
  const groups: Record<string, Partial<Record<Person, number>>> = {};
  for (const day of days) {
    const groupDate = DateTime.fromISO(day.date).startOf(granularityToDateTimeUnit(granularity)).toISODate()!;
    const group = groups[groupDate] ?? (groups[groupDate] = {});
    for (const person of day.people) group[person] = (group[person] ?? 0) + 1;
  }
  return Object.entries(groups).map(([date, people]) => ({ group: DateTime.fromISO(date).toMillis(), ...people }));
}

export function accumulatedContributions(days: Day[], granularity: Granularity, people: Person[]) {
  const grouped = groupContributions(days, granularity);
  const totals = Object.fromEntries(people.map(person => [person, 0])) as Record<Person, number>;
  return grouped.map(({ group, ...counts }) => {
    for (const person of people) totals[person] += counts[person] ?? 0;
    return { groupName: group, ...totals };
  });
}

export function participationSummary(days: Day[], people: Person[]) {
  const fullDays = days.filter(day => day.people.length === people.length).length;
  const activeDays = days.filter(day => day.people.length > 0).length;
  const almostDays = days.filter(day => day.people.length === people.length - 1);
  const misses = people.map(person => ({
    person,
    days: almostDays.filter(day => !day.people.includes(person)).length,
  })).sort((a, b) => b.days - a.days);
  return { fullDays, activeDays, almostDays: almostDays.length, misses };
}

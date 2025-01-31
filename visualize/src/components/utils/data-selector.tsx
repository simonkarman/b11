"use client";

import { Day, everyone, Person } from '@/components/utils/data-downloader';
import { DateTime, DateTimeUnit } from 'luxon';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

export const granularities = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'] as const;
export type Granularity = typeof granularities[number];
export const granularityToFormat = (granularity: Granularity) => {
  return {
    'yearly': 'yyyy',
    'quarterly': '\'Q\'q - yyyy',
    'monthly': 'LLL yyyy',
    'weekly': '\'Week\' W - yyyy',
    'daily': 'yyyy-MM-dd',
  }[granularity];
};
export const granularityToDateTimeUnit = (granularity: Granularity): DateTimeUnit => {
  switch (granularity) {
    case 'yearly': return 'year';
    case 'quarterly': return 'quarter';
    case 'monthly': return 'month';
    case 'weekly': return 'week';
    case 'daily': return 'day';
  }
}

type SelectedData = {
  initialStartDate: string,
  startDate: string,
  setStartDate: (date: string) => void,
  initialEndDate: string,
  endDate: string,
  setEndDate: (date: string) => void,
  allPeople: typeof everyone,
  people: Person[],
  setPeople: (people: Person[]) => void,
  granularity: Granularity | undefined,
  setGranularity: (granularity: Granularity | undefined) => void,
  allDays: Day[],
  days: Day[],
};
const SelectedDataContext = createContext<SelectedData | null>(null);

export const useSelectedData = (): SelectedData => {
  const context = useContext(SelectedDataContext);
  if (context === null) {
    throw new Error('useSelectedData must be used within a DataSelector');
  }
  return context;
}

export function DataSelector(props: PropsWithChildren<{ source: Day[] }>) {
  const { source } = props;
  const initialStartDate = source[0].date;
  const initialEndDate = source[source.length - 1].date;
  const lastDay = DateTime.fromISO(initialEndDate) as DateTime<true>;
  const [startDate, setStartDate] = useState<string>(lastDay.startOf('year').toISODate());
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const allPeople = everyone;
  const [people, setPeople] = useState<Person[]>([...everyone]);
  const [granularity, setGranularity] = useState<Granularity | undefined>(undefined);

  const allDays = source;
  const days = source.filter(day => DateTime.fromISO(day.date) >= DateTime.fromISO(startDate)
                                 && DateTime.fromISO(day.date) <= DateTime.fromISO(endDate))
    .map(day => ({ ...day, people: day.people.filter(person => people.length === 0 || people.includes(person)) }));

  return <SelectedDataContext.Provider value={{
    initialStartDate, startDate, setStartDate,
    initialEndDate, endDate, setEndDate,
    allPeople, people, setPeople,
    granularity, setGranularity,
    allDays, days,
  }}>
    {props.children}
  </SelectedDataContext.Provider>;
}

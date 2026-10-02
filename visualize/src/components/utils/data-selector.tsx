"use client";

import { selectDays } from '@/analysis/days';
import { Granularity } from '@/analysis/granularity';
import { Day, everyone, Person } from '@/data/days';
import { DateTime } from 'luxon';
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

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
  const days = useMemo(() => selectDays(source, startDate, endDate, people), [source, startDate, endDate, people]);

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

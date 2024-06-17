"use client";

import { Day, Person } from '@/components/data-downloader';
import { DateTime } from 'luxon';
import { useState, createContext, PropsWithChildren, useContext } from 'react';

type SelectedData = {
  startDate: string,
  setStartDate: (date: string) => void,
  endDate: string,
  setEndDate: (date: string) => void,
  people: Person[],
  setPeople: (people: Person[]) => void,
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
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);
  const [people, setPeople] = useState<Person[]>([]);

  const days = source.filter(day => DateTime.fromISO(day.date) >= DateTime.fromISO(startDate)
                                 && DateTime.fromISO(day.date) <= DateTime.fromISO(endDate));

  return <SelectedDataContext.Provider value={{
    startDate, setStartDate,
    endDate, setEndDate,
    people, setPeople,
    days,
  }}>
    {props.children}
  </SelectedDataContext.Provider>;
}

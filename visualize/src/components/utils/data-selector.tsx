"use client";

import { Day, everyone, Person } from '@/components/utils/data-downloader';
import { DateTime, DateTimeUnit } from 'luxon';
import { useState, createContext, PropsWithChildren, useContext } from 'react';

export const stepSizes = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'] as const;
export type StepSize = typeof stepSizes[number];
export const stepSizeToFormat = (stepSize: StepSize) => {
  return {
    'yearly': 'yyyy',
    'quarterly': 'yyyy-Qq',
    'monthly': 'yyyy-\'M\'M',
    'weekly': 'yyyy-\'W\'W',
    'daily': 'yyyy-MM-dd',
  }[stepSize];
};
export const toDateTimeUnit = (stepSize: StepSize): DateTimeUnit => {
  switch (stepSize) {
    case 'yearly': return 'year';
    case 'quarterly': return 'quarter';
    case 'monthly': return 'month';
    case 'weekly': return 'week';
    case 'daily': return 'day';
  }
}

type SelectedData = {
  startDate: string,
  setStartDate: (date: string) => void,
  endDate: string,
  setEndDate: (date: string) => void,
  people: Person[],
  setPeople: (people: Person[]) => void,
  stepSize: StepSize | undefined,
  setStepSize: (stepSize: StepSize | undefined) => void,
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
  const [people, setPeople] = useState<Person[]>([...everyone]);
  const [stepSize, setStepSize] = useState<StepSize | undefined>(undefined);

  const days = source.filter(day => DateTime.fromISO(day.date) >= DateTime.fromISO(startDate)
                                 && DateTime.fromISO(day.date) <= DateTime.fromISO(endDate))
    .map(day => ({ ...day, people: day.people.filter(person => people.length === 0 || people.includes(person)) }));

  return <SelectedDataContext.Provider value={{
    startDate, setStartDate,
    endDate, setEndDate,
    people, setPeople,
    stepSize, setStepSize,
    days,
  }}>
    {props.children}
  </SelectedDataContext.Provider>;
}

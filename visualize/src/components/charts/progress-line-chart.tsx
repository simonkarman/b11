"use client";

import { capitalize } from '@/components/card';
import { Day, Person } from '@/components/utils/data-downloader';
import { Granularity, granularityToDateTimeUnit, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { LineChart } from '@/components/utils/line-chart';

function getAccumulatedData(days: Day[], granularity: Granularity, people: Person[]) {
  const groups: Record<string, Record<Person, { count: number, acc: number }>> = {};
  days.forEach(day => {
    const groupStartDate = DateTime.fromISO(day.date).startOf(granularityToDateTimeUnit(granularity)).toISODate();
    if (groupStartDate === null) {
      return;
    }
    groups[groupStartDate] = day.people.reduce((acc, person) => {
      acc[person].count += 1;
      return acc;
    }, (groups[groupStartDate] || Object.fromEntries(people.map(n => [n, { count: 0, acc: 0 }]))) as Record<Person, { count: number, acc: number }>);
  });
  const groupsAsArr = Object.entries(groups);
  for (let groupIndex = 0; groupIndex < groupsAsArr.length; groupIndex++) {
    const [_, people] = groupsAsArr[groupIndex];
    people && Object.entries(people).forEach(([name, value]) => {
      const previous = groupIndex === 0 ? 0 : groupsAsArr[groupIndex - 1][1][name as Person].acc;
      value.acc = previous + value.count;
    });
  }
  return Object.entries(groups).map(([groupStartDate, people]) => ({
    groupName: DateTime.fromISO(groupStartDate).toMillis(),
    ...(Object.fromEntries(Object.entries(people).map(([name, value]) => [name, value.acc || 0]))),
  }));
}

export const ProgressLineChart = () => {
  const { days, granularity: _granularity, people } = useSelectedData();
  const granularity = _granularity ?? 'daily';
  const data = getAccumulatedData(days, granularity, people);
  return <LineChart
    title={'Progress'}
    description={`${capitalize(granularity)} accumulative progress per person.`}
    data={data}
  ></LineChart>
}

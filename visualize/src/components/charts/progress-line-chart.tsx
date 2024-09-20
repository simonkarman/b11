"use client";

import { capitalize, Card } from '@/components/card';
import { colors, Day, Person } from '@/components/utils/data-downloader';
import { Granularity, granularityToDateTimeUnit, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  const { days, granularity: _granularity, people, startDate, endDate } = useSelectedData();
  const granularity = _granularity ?? 'daily';
  const data = getAccumulatedData(days, granularity, people);
  const gdt = granularityToDateTimeUnit(granularity);
  const domainStart = DateTime.fromISO(startDate).startOf(gdt);
  const domainEnd = DateTime.fromISO(endDate).startOf(gdt);
  const domainDays = domainEnd.diff(domainStart, 'days').days;
  const halfDomain = domainStart.plus({ day: Math.floor(domainDays / 2) });
  const tickLocations = domainDays < 8 ? [domainStart, halfDomain, domainEnd] : [
    domainStart,
    domainStart.plus({ day: Math.floor(domainDays / 4) }),
    halfDomain,
    domainStart.plus({ day: Math.floor((3 * domainDays) / 4) }),
    domainEnd,
  ];
  const labelFormatter = (v: number) => DateTime.fromMillis(v).toISODate()!;
  return <Card isChart title={'Progress'} description={`${capitalize(granularity)} accumulative progress per person.`}>
    <ResponsiveContainer aspect={16 / 9} maxHeight={700}>
      <LineChart data={data}>
        <Tooltip
          position={{ x: 10, y: 10 }}
          labelFormatter={v => <pre>{labelFormatter(v)}</pre>}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          animationDuration={250}
          animationEasing={'ease-in-out'}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="7 5" />
        <XAxis
          dataKey="groupName"
          type='number'
          className='text-xs'
          domain={[ domainStart, domainEnd ].map(d => d.toMillis())}
          ticks={tickLocations.map(d => d.toMillis())}
          interval={'preserveStartEnd'}
          tickFormatter={labelFormatter}
        />
        <YAxis
          tickCount={11}
          minTickGap={1}
          orientation='right'
          domain={[0, 'dataMax']}
          className='text-xs'
          width={25}
        />
        {people.map(name => (<Line
          key={name}
          type={'linear'}
          connectNulls
          dataKey={name}
          stroke={colors[name].rgb}
          dot={false}
        />))}
      </LineChart>
    </ResponsiveContainer>
  </Card>;
}

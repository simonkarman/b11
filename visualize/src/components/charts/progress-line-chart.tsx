"use client";

import { Card } from '@/components/card';
import { colors, Day, Person } from '@/components/utils/data-downloader';
import { Granularity, granularityToDateTimeUnit, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  return <Card title={'Progress'} description={`Line chart showing the ${granularity} progress per person over time.`}>
    <div className='max-w-xl overflow-hidden'>
      <ResponsiveContainer aspect={16/9}>
        <LineChart syncId='default' data={data}>
          <Legend />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="7 5"/>
          <XAxis dataKey="groupName" type='number' className='text-xs' tickCount={10} domain={[
            DateTime.fromISO(startDate).startOf(granularityToDateTimeUnit(granularity)).toMillis(),
            DateTime.fromISO(endDate).startOf(granularityToDateTimeUnit(granularity)).toMillis(),
          ]} />
          <YAxis tickCount={11} orientation='right' domain={[0, 'dataMax']} className='text-xs' />
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
    </div>
  </Card>;
}

"use client";

import { Card } from '@/components/card';
import { Person } from '@/components/utils/data-downloader';
import { stepSizeToFormat, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';

const colors = [
  'rgb(248 113 113)',
  'rgb(239 68 68)',
  'rgb(220 38 38)',
  'rgb(185 28 28)',
  'rgb(153 27 27)',
  'rgb(127 29 29)',
];

export const ProgressLineChart = () => {
  const { days, stepSize, people } = useSelectedData();
  const steps: Record<string, Record<Person, { count: number, acc: number }>> = {};
  days.forEach(day => {
    const date = DateTime.fromISO(day.date);
    const step = date.toFormat(stepSizeToFormat[stepSize]);
    steps[step] = day.people.reduce((acc, person) => {
      acc[person].count += 1;
      return acc;
    }, (steps[step] || Object.fromEntries(people.map(n => [n, { count: 0, acc: 0 }]))) as Record<Person, { count: number, acc: number }>);
  });
  const stepsAsArr = Object.entries(steps);
  for (let stepIndex = 0; stepIndex < stepsAsArr.length; stepIndex++) {
    const [_, people] = stepsAsArr[stepIndex];
    people && Object.entries(people).forEach(([name, value]) => {
      const previous = stepIndex === 0 ? 0 : stepsAsArr[stepIndex - 1][1][name as Person].acc;
      value.acc = previous + value.count;
    })
  }
  const data = Object.entries(steps).map(([name, people]) => ({
    name,
    ...(Object.fromEntries(Object.entries(people).map(([name, value]) => [name, value.acc || 0])))
  }));
  return <Card title={'Progress'} description={'Line chart showing the progress per person over time.'}>
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="name" className='text-xs' />
      <YAxis className='text-xs' />
      {people.map((name, index) => (<Line
        key={name}
        type="monotone"
        connectNulls
        dataKey={name}
        stroke={colors[index]}
        dot={false}
      />))}
    </LineChart>
  </Card>;
}

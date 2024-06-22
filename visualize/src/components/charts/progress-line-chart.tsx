"use client";

import { Card } from '@/components/card';
import { colors, Day, Person } from '@/components/utils/data-downloader';
import { StepSize, stepSizeToDateTimeUnit, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function getAccumulatedData(days: Day[], stepSize: StepSize, people: Person[]) {
  const steps: Record<string, Record<Person, { count: number, acc: number }>> = {};
  days.forEach(day => {
    const stepStartDate = DateTime.fromISO(day.date).startOf(stepSizeToDateTimeUnit(stepSize)).toISODate();
    if (stepStartDate === null) {
      return;
    }
    steps[stepStartDate] = day.people.reduce((acc, person) => {
      acc[person].count += 1;
      return acc;
    }, (steps[stepStartDate] || Object.fromEntries(people.map(n => [n, { count: 0, acc: 0 }]))) as Record<Person, { count: number, acc: number }>);
  });
  const stepsAsArr = Object.entries(steps);
  for (let stepIndex = 0; stepIndex < stepsAsArr.length; stepIndex++) {
    const [_, people] = stepsAsArr[stepIndex];
    people && Object.entries(people).forEach(([name, value]) => {
      const previous = stepIndex === 0 ? 0 : stepsAsArr[stepIndex - 1][1][name as Person].acc;
      value.acc = previous + value.count;
    });
  }
  return Object.entries(steps).map(([stepStartDate, people]) => ({
    stepName: DateTime.fromISO(stepStartDate).toMillis(),
    ...(Object.fromEntries(Object.entries(people).map(([name, value]) => [name, value.acc || 0]))),
  }));
}

export const ProgressLineChart = () => {
  const { days, stepSize: _stepSize, people, startDate, endDate } = useSelectedData();
  const stepSize = _stepSize ?? 'daily';
  const data = getAccumulatedData(days, stepSize, people);
  return <Card title={'Progress'} description={`Line chart showing the ${stepSize} progress per person over time.`}>
    <div className='max-w-xl overflow-hidden'>
      <ResponsiveContainer aspect={16/9}>
        <LineChart syncId='default' data={data}>
          <Legend />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="7 5"/>
          <XAxis dataKey="stepName" type='number' className='text-xs' tickCount={10} domain={[
            DateTime.fromISO(startDate).startOf(stepSizeToDateTimeUnit(stepSize)).toMillis(),
            DateTime.fromISO(endDate).startOf(stepSizeToDateTimeUnit(stepSize)).toMillis(),
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

"use client";

import { Card } from '@/components/card';
import { colors } from '@/components/utils/data-downloader';
import { granularityToDateTimeUnit, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { CartesianGrid, Line, LineChart as LineChart_, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const LineChart = (props: {
  title: string,
  description: string,
  data: { groupName: number }[],
}) => {
  const { title, description, data } = props;
  const { granularity: _granularity, people, startDate, endDate } = useSelectedData();
  const granularity = _granularity ?? 'daily';
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
  return <Card title={title} description={description} canMagnify restrictWidth>
    <ResponsiveContainer aspect={16 / 9} maxHeight={700}>
      <LineChart_ data={data}>
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
      </LineChart_>
    </ResponsiveContainer>
  </Card>;
}

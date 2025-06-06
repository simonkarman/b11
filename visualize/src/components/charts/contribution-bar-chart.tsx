import { capitalize, Card } from '@/components/card';
import { colors, Day, Person } from '@/components/utils/data-downloader';
import { granularities, Granularity, granularityToDateTimeUnit, granularityToFormat, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function groupContributions(days: Day[], granularity: Granularity) {
  const groups: Record<string, Record<Person, number>> = {};
  days.forEach(day => {
    const groupStartDate = DateTime.fromISO(day.date).startOf(granularityToDateTimeUnit(granularity)).toISODate();
    if (groupStartDate === null) {
      return;
    }
    const group = groups[groupStartDate] || {};
    day.people.forEach(name => {
      group[name] = (group[name] || 0) + 1;
    });
    groups[groupStartDate] = group;
  });
  return Object.entries(groups).map(([group, people]) => ({ group: DateTime.fromISO(group).toMillis()!, ...people }));
}

export const ContributionBarChart = () => {
  const { days, granularity: _granularity, people } = useSelectedData();

  // Find the best granularity to display the data
  // Start at the chosen granularity and keep choosing a less granular one as long as there are more than 10 bars
  let granularityIndex = (_granularity === undefined ? granularities.length - 2 : granularities.indexOf(_granularity)) + 1;
  let data: unknown[];
  do {
    granularityIndex -= 1;
    data = groupContributions(days, granularities[granularityIndex]);
  } while (data.length > (_granularity === undefined ? 10 : 15) && granularityIndex > 0);
  const granularity = granularities[granularityIndex];

  const labelFormatter = (v: number) => DateTime.fromMillis(v).toFormat(granularityToFormat(granularity))!;
  return <Card title="Contribution" description={`${capitalize(granularity)} contribution per person.`} canMagnify restrictWidth>
    <ResponsiveContainer aspect={16 / 9} maxHeight={500}>
      <BarChart data={data}>
        <Tooltip
          labelFormatter={labelFormatter}
          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          cursor={{ fill: 'rgba(40, 40, 90, 0.05)' }}
        />
        <XAxis
          dataKey='group'
          className='text-xs'
          tickFormatter={labelFormatter}
        />
        <YAxis className='text-xs' width={25} />
        {people.map(name => <Bar
          key={name}
          dataKey={name}
          fill={colors[name].rgb}
        />)}
      </BarChart>
    </ResponsiveContainer>
  </Card>
}

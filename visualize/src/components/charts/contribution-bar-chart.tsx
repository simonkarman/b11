import { capitalize, Card } from '@/components/card';
import { groupContributions } from '@/analysis/days';
import { granularities, granularityToFormat } from '@/analysis/granularity';
import { colors } from '@/data/days';
import { useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';

export const ContributionBarChart = () => {
  const { days, granularity: _granularity, people } = useSelectedData();

  // Find the best granularity to display the data
  // Start at the chosen granularity and keep choosing a less granular one as long as there are more than 10 bars
  const { data, granularity } = useMemo(() => {
    let granularityIndex = (_granularity === undefined ? granularities.length - 2 : granularities.indexOf(_granularity)) + 1;
    let data;
    do {
      granularityIndex -= 1;
      data = groupContributions(days, granularities[granularityIndex]);
    } while (data.length > (_granularity === undefined ? 10 : 15) && granularityIndex > 0);
    return { data, granularity: granularities[granularityIndex] };
  }, [days, _granularity]);

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

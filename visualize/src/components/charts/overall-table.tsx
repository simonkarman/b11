import { Card } from '@/components/card';
import { countPosts } from '@/analysis/days';
import { colors } from '@/data/days';
import { useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const OverallTable = () => {
  const { startDate, endDate, days, people } = useSelectedData();
  const counts = useMemo(() => countPosts(days, people), [days, people]);
  const sortedNames = [...people].sort((a, b) => counts[b].exact - counts[a].exact);
  const numberOfDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').days + 1;

  return <Card title='Overall 11:11s' description='Number of 11:11s posted per person.'>
    <table className='text-left'>
      <thead>
        <tr>
          <th className='text-slate-700 text-sm pr-2'></th>
          <th className='text-slate-700 text-sm px-2 text-center'>Amount</th>
          <th className='text-slate-700 text-sm px-2 text-center'>%</th>
        </tr>
      </thead>
      <tbody>
        {sortedNames.map(name => (
            <tr key={name}>
              <td className="pr-2">{name[0].toUpperCase() + name.slice(1)}</td>
              <td className={`px-2 text-center text-lg font-bold ${colors[name].textClass}`}>
                {counts[name].exact}
              </td>
              <td className="px-2 text-center text-md text-slate-800">
                {(counts[name].exact / numberOfDays * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    <p className='mt-2 text-xs text-slate-600'>% = percentage of {numberOfDays} days</p>
  </Card>;
}

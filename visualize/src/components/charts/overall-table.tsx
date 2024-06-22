import { Card } from '@/components/card';
import { colors, Person } from '@/components/utils/data-downloader';
import { useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';

export const OverallTable = () => {
  const { startDate, endDate, days, people } = useSelectedData();
  const counts = days.reduce((acc, day) => {
    day.people.forEach(person => {
      acc[person] = (acc[person] || 0) + 1;
    });
    return acc;
  }, {} as Record<Person, number | undefined>);
  const sortedNames = [...people].sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));
  const numberOfDays = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days').days;

  return <Card title='Overall 11:11s' description='The overall number of 11:11s posted per person.'>
    <table className='text-left'>
      <thead>
        <tr className='border-b'>
          <th className='pr-2'>Name</th>
          <th className='px-2 text-center'>Count</th>
          <th className='px-2 text-center'>% of {numberOfDays} days</th>
        </tr>
      </thead>
      <tbody>
        {sortedNames.map(name => (
            <tr key={name}>
              <td className="pr-2">{name[0].toUpperCase() + name.slice(1)}</td>
              <td className={`px-2 text-center text-lg font-bold ${colors[name].textClass}`}>
                {counts[name] ?? 0}
              </td>
              <td className="px-2 text-center">
                {(counts[name] ?? 0) / numberOfDays * 100 | 0}%
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </Card>;
}

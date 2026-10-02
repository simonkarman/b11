import { capitalize, Card } from '@/components/card';
import { participationSummary } from '@/analysis/days';
import { useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

export const FunFacts = () => {
  const { initialStartDate: startDate, allDays: days, allPeople: people } = useSelectedData();
  const summary = useMemo(() => participationSummary(days, [...people]), [days, people]);

  return <Card title='Fun Facts' restrictWidth>
    <div className='space-y-4'>
      <p className={'md:max-w-1/3'}>
        The first 11:11 was posted on <strong>{startDate}</strong>, which is {DateTime.now().startOf('day').diff(DateTime.fromISO(startDate), 'days').days} days ago.
        In that timeframe on <strong>{summary.activeDays}</strong> days, at least one person has posted.
      </p>
      <p className='pb-2'>
        On <strong className="text-red-700 text-2xl">{summary.fullDays}</strong> days, everyone posted at 11:11.
      </p>
      <p className='text-gray-700 italic text-sm'>
        On <strong>{summary.almostDays}</strong> days, we came close to achieving full participation, with just one person missing each time. Most often missing: {summary.misses.map(({ person, days }) => `${capitalize(person)} (${days})`).join(', ')}.
      </p>
    </div>
  </Card>;
}

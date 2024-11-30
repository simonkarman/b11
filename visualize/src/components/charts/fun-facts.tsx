import { capitalize, Card } from '@/components/card';
import { useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';

export const FunFacts = () => {
  const { initialStartDate: startDate, initialEndDate: endDate, allDays: days, allPeople: people } = useSelectedData();

  const days_everyone = days.filter(day => day.people.length === people.length).length;
  const days_at_least_one = days.filter(day => day.people.length > 0).length;

  const days_one_short = days.filter(day => day.people.length === people.length - 1);
  const person_one_short = Object.entries(days_one_short
      .map(day => people.filter(person => !day.people.includes(person))[0])
      .reduce((acc, person) => {
        acc[person] = (acc[person] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number | undefined })
    )
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .map(([person, days]) => ({ name: capitalize(person), days: days || 0 }));

  return <Card title='Fun Facts' restrictWidth>
    <div className='space-y-4'>
      <p className={'md:max-w-1/3'}>
        The first 11:11 was posted on <strong>{startDate}</strong>, which is {DateTime.now().startOf('day').diff(DateTime.fromISO(startDate), 'days').days} days ago.
        In that timeframe on <strong>{days_at_least_one}</strong> days, at least one person has posted.
      </p>
      <p className='pb-2'>
        On <strong className="text-red-700 text-2xl">{days_everyone}</strong> days, everyone posted at 11:11.
      </p>
      <p className='text-gray-700 italic text-sm'>
        On <strong>{days_one_short.length}</strong> days, we came close to achieving full participation, with just one person missing each time. <strong>{person_one_short[0].name}</strong> was absent most frequently ({person_one_short[0].days} days), followed by {person_one_short[1].name} ({person_one_short[1].days} days) and {person_one_short[2].name} ({person_one_short[2].days} days). {person_one_short[3].name} missed {person_one_short[3].days} days, while {person_one_short[4].name} and <strong>{person_one_short[5].name}</strong> were absent least often, missing {person_one_short[4].days} and {person_one_short[5].days} days respectively.
      </p>
    </div>
  </Card>;
}

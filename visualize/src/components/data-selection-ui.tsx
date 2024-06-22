import { colors, everyone } from '@/components/utils/data-downloader';
import { stepSizes, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';

export const DataSelectionUi = () => {
  const { initialStartDate, initialEndDate, startDate, setStartDate, endDate, setEndDate, people, setPeople, stepSize, setStepSize } = useSelectedData();
  const buttonStyle = 'rounded px-1.5 py-0.5 border border-gray-700 bg-gray-500 hover:bg-gray-600 text-white';
  const sectionClasses = 'border border-dotted hover:bg-gray-100 py-1 px-2 flex gap-3 flex-wrap text-xs justify-end items-center text-gray-700';

  const lastDay = DateTime.fromISO(initialEndDate) as DateTime<true>;
  const ranges: { name: string, start: string, end: string }[] = [
    { name: '7d', start: lastDay.minus({ days: 7 }).toISODate(), end: initialEndDate },
    { name: '30d', start: lastDay.minus({ days: 30 }).toISODate(), end: initialEndDate },
    { name: '90d', start: lastDay.minus({ days: 90 }).toISODate(), end: initialEndDate },
    { name: '365d', start: lastDay.minus({ days: 365 }).toISODate(), end: initialEndDate },
    { name: 'ytd', start: lastDay.startOf('year').toISODate(), end: initialEndDate },
    { name: 'all', start: initialStartDate, end: initialEndDate },
  ];

  return <div className='w-full flex flex-wrap sm:justify-end gap-3'>
    <div className={sectionClasses}>
      <p className='hidden sm:block'>People</p>
      {everyone.map(name => <button
        key={name}
        className={`${buttonStyle} flex items-center`}
        disabled={people.length === 1 && people.includes(name)}
        onClick={() => {
          setPeople(people.includes(name) ? people.filter(n => n !== name) : [...people, name]);
        }}>
        <span
          className={`w-3 h-3 border-gray-300 rounded border inline-block ${people.includes(name) ? colors[name].bgClass : 'bg-gray-400'} mr-1.5`}/>
        {name}
      </button>)}
    </div>
    <div className={sectionClasses}>
      <p>StepSize</p>
      <button className={buttonStyle} onClick={() => {
        const index = (stepSizes.indexOf(stepSize!) + 1) % (stepSizes.length + 1);
        setStepSize(index === stepSizes.length ? undefined : stepSizes[index]);
      }}>
        {stepSize ?? 'default'}
      </button>
    </div>
    <div className={sectionClasses}>
      <p>Range {startDate} to {endDate}</p>
      {ranges.map(({ name, start, end}) => {
        const isActive = startDate === start && endDate === end;
        return <button
          key={name}
          className={`${buttonStyle} ${isActive ? 'bg-gray-700' : ''}`}
          onClick={() => {
            setStartDate(start);
            setEndDate(end);
          }}
        >
          {name}
        </button>;
      })}
    </div>
  </div>;
}

import { colors, everyone } from '@/components/utils/data-downloader';
import { granularities, useSelectedData } from '@/components/utils/data-selector';
import { DateTime } from 'luxon';

export const DataSelectionUi = () => {
  const { initialStartDate, initialEndDate, startDate, setStartDate, endDate, setEndDate, people, setPeople, granularity, setGranularity } = useSelectedData();
  const buttonStyle = 'rounded border px-1.5 py-0.5 hover:border-slate-400 hover:shadow';
  const sectionWrapper = 'rounded flex flex-wrap flex-col lg:flex-row justify-center items-center p-1 px-2 gap-2 text-xs items-center text-slate-700';
  const sectionButtons = 'flex items-center justify-center flex-wrap gap-2';
  const sectionTitle = 'text-xs text-slate-600';

  const lastDay = DateTime.fromISO(initialEndDate) as DateTime<true>;
  const ranges: { name: string, start: string, end: string }[] = [
    { name: '7d', start: lastDay.minus({ days: 6 }).toISODate(), end: initialEndDate },
    { name: '30d', start: lastDay.minus({ days: 29 }).toISODate(), end: initialEndDate },
    { name: '90d', start: lastDay.minus({ days: 89 }).toISODate(), end: initialEndDate },
    { name: '6m', start: lastDay.minus({ months: 6, days: -1 }).toISODate(), end: initialEndDate },
    { name: '1y', start: lastDay.minus({ year: 1, days: -1 }).toISODate(), end: initialEndDate },
    { name: 'ytd', start: lastDay.startOf('year').toISODate(), end: initialEndDate },
    { name: 'all', start: initialStartDate, end: initialEndDate },
  ];

  return <div className='w-full flex flex-wrap justify-center items-center lg:justify-end gap-x-4 gap-y-3 lg:gap-y-1'>
    <div className={sectionWrapper}>
      <p className={sectionTitle}>People</p>
      <div className={sectionButtons}>
        {everyone.map(name => {
          const isSelected = people.includes(name);
          return <button
            key={name}
            className={`${buttonStyle} ${isSelected ? '' : 'text-slate-400 border-slate-100'} flex items-center`}
            disabled={people.length === 1 && isSelected}
            onClick={() => {
              if (isSelected) {
                setPeople(people.filter(n => n !== name));
              } else {
                setPeople(everyone.filter(n => people.includes(n) || n === name));
              }
            }}>
          <span
            className={`w-3 h-3 rounded border ${colors[name].border} inline-block ${isSelected && colors[name].bgClass} mr-1.5`}/>
            {name}
          </button>;
        })}
      </div>
    </div>
    <div className={sectionWrapper}>
      <p className={sectionTitle}>Selected {startDate} to {endDate}</p>
      <div className={sectionButtons}>
        {ranges.map(({ name, start, end }) => {
          const isActive = startDate === start && endDate === end;
          return <button
            key={name}
            className={`${buttonStyle} ${isActive ? 'bg-slate-600 border-slate-800 text-white' : ''}`}
            onClick={() => {
              setStartDate(start);
              setEndDate(end);
            }}
          >
            {name}
          </button>;
        })}
      </div>
    </div>
    <div className={sectionWrapper}>
      <p className={sectionTitle}>Granularity</p>
      <div className={sectionButtons}>
        <button className={buttonStyle} onClick={() => {
          const index = (granularities.indexOf(granularity!) + 1) % (granularities.length + 1);
          setGranularity(index === granularities.length ? undefined : granularities[index]);
        }}>
          {granularity ?? 'default'}
        </button>
      </div>
    </div>
  </div>;
}

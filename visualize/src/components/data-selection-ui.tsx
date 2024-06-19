import { everyone } from '@/components/utils/data-downloader';
import { stepSizes, useSelectedData } from '@/components/utils/data-selector';

export const DataSelectionUi = () => {
  const { startDate, setStartDate, endDate, setEndDate, people, setPeople, stepSize, setStepSize } = useSelectedData();
  const buttonStyle = 'rounded px-1.5 py-0.5 border border-gray-700 bg-gray-500 hover:bg-gray-600 text-white';
  return <div className='w-full border border-dotted hover:bg-gray-100 py-1 px-2 flex gap-3 flex-wrap text-xs justify-end items-center text-gray-700'>
    <p>People</p>
    <button className={buttonStyle} onClick={() => {
      setPeople(people.length === 6 ? ['simon', 'rogier'] : [...everyone]);
    }}>
      {people.length === 0 ? 'everyone' : people.join(', ')}
    </button>
    <p>|</p>
    <p>StepSize</p>
    <button className={buttonStyle} onClick={() => {
      const index = (stepSizes.indexOf(stepSize!) + 1) % (stepSizes.length + 1);
      setStepSize(index === stepSizes.length ? undefined : stepSizes[index]);
    }}>
      {stepSize ?? 'default'}
    </button>
    <p>|</p>
    <p>Range {startDate} to {endDate}</p>
    <button className={buttonStyle} onClick={() => {
      setStartDate('2024-01-01');
      setEndDate('2024-06-15');
    }}>
      ytd
    </button>
    <button className={buttonStyle} onClick={() => {
      setStartDate('2016-06-14');
      setEndDate('2024-06-15');
    }}>
      all
    </button>
  </div>;
}

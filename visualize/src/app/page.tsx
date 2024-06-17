"use client";

import { BarChart } from '@/components/bar-chart';
import { Card } from '@/components/card';
import { Overall } from '@/components/charts/overall';
import { useSelectedData } from '@/components/data-selector';
import { Spinner } from '@/components/spinner';

export default function Home() {
  const { startDate, setStartDate, endDate, setEndDate } = useSelectedData();
  return (<>
    <div className='w-full justify-between flex flex-wrap py-2 gap-2'>
      <div className='w-full flex gap-3 flex-wrap text-xs justify-end'>
        <p>Date Range from {startDate} until {endDate}</p>
        <button
          className='px-1 border bg-gray-300 hover:bg-gray-400'
          onClick={() => { setStartDate('2016-06-14'); setEndDate('2024-06-15'); }}
        >
          all
        </button>
        <button
          className='px-1 border bg-gray-300 hover:bg-gray-400'
          onClick={() => { setStartDate('2024-01-01'); setEndDate('2024-06-15'); }}
        >
          ytd
        </button>
      </div>
      <Overall />
      <BarChart/>
      <Card title={'Spinner'} description={'Example of some spinners at different sizes.'}>
        <Spinner size={'sm'}/>
        <Spinner size={'md'}/>
        <Spinner size={'lg'}/>
      </Card>
    </div>
  </>);
}

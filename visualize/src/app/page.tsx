"use client";

import { BarChart } from '@/components/bar-chart';
import { Card } from '@/components/card';
import { Spinner } from '@/components/spinner';

export default function Home() {
  // https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.txt
  // https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.json
  return (
    <div className='flex flex-wrap p-2'>
      <BarChart />
      <BarChart />
      <BarChart />
      <BarChart />
      <BarChart />
      <Card title={'Spinner'}>
        <Spinner size={'sm'} />
        <Spinner size={'md'} />
        <Spinner size={'lg'} />
      </Card>
    </div>
  )
}

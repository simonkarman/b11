"use client";

import { BarChart } from '@/components/bar-chart';

export default function Home() {
  return (
    <div className='flex flex-wrap p-2'>
      <BarChart />
      <BarChart />
      <BarChart />
      <BarChart />
      <BarChart />
    </div>
  )
}

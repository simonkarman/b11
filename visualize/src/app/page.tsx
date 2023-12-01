"use client";

import { BarChart } from '@/component/bar-chart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-12">
      <div className='bg-white w-full p-10 rounded shadow-lg'>
        <h1 className='text-xl font-bold mb-2'>B11</h1>
        <p>Analyze and view b11 posts on 11:11.</p>
        <p>Source: <a className='text-blue-600' href='https://github.com/simonkarman/b11'>GitHub</a></p>
      </div>
      <BarChart />
    </main>
  )
}

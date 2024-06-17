"use client";

import { BarChart } from '@/components/bar-chart';
import { Card } from '@/components/card';
import { Spinner } from '@/components/spinner';

export default function Home() {
  const txtUrl = 'https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.txt';
  const jsonUrl = 'https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.json';

  return (
    <div className='w-full justify-between flex flex-wrap py-4 gap-2'>
      <Card title='Lifetime 11:11s'>
        <p className='text-sm text-gray-600'>The number of 11:11s posted per person over the whole lifetime of the group.</p>
        <table className='text-left'>
          <thead>
            <tr className='border-b'><th className='pr-2'>Name</th><th className='px-2'>Count</th></tr>
          </thead>
          <tbody>
            <tr><td className='pr-2'>Raoul</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
            <tr><td className='pr-2'>Thomas</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
            <tr><td className='pr-2'>Yorick</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
            <tr><td className='pr-2'>Robin</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
            <tr><td className='pr-2'>Simon</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
            <tr><td className='pr-2'>Rogier 👑</td><td className='px-2 text-lg font-bold text-red-800'>123</td></tr>
          </tbody>
        </table>
      </Card>
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

"use client";

import { BarChart } from '@/components/bar-chart';
import { Card } from '@/components/card';
import { Spinner } from '@/components/spinner';
import { useEffect, useState } from 'react';

type Data<T> = { state: 'loading' } | { state: 'error', error: Error } | { state: 'ready', data: T };
const names = ['Raoul', 'Thomas', 'Yorick', 'Robin', 'Simon', 'Rogier'];

const getValue = (data: { exact: number, close: number }, measure: 'exact' | 'close') => {
  if (measure === 'exact') return data.exact;
  return data.exact + data.close
}

export default function Home() {
  // TODO: Move to a React context/provider
  const jsonUrl = 'https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.json';
  const [jsonData, setJsonData] = useState<Data<any>>({ state: 'loading' });
  useEffect(() => {
    fetch(jsonUrl)
      .then(response => response.json())
      .then(data => setJsonData({ state: 'ready', data }))
      .catch(error => setJsonData({ state: 'error', error }));
  }, []);

  // TODO: move to a React context/provider
  const [measure, setMeasure] = useState<'exact' | 'close'>('exact');

  return (
    <div className='w-full justify-between flex flex-wrap py-4 gap-2'>
      {/* TODO: create into separate component */}
      <Card title='Lifetime 11:11s'>
        <input type='checkbox' checked={measure === 'exact'} onChange={e => setMeasure(e.target.checked ? 'exact' : 'close')} />
        <label className='ml-2'>Exact Only</label>
        {jsonData.state === 'error' && <p className='text-red-800'>{jsonData.error.message}</p>}
        {jsonData.state !== 'error' && (<>
          <p className='text-sm text-gray-600'>The number of 11:11s posted per person over the whole lifetime of the group.</p>
          <table className='text-left'>
            <thead>
              <tr className='border-b'><th className='pr-2'>Name</th><th className='px-2'>Count</th></tr>
            </thead>
            <tbody>
              {names.map(name => <tr>
                <td className="pr-2">{name}</td>
                <td className="px-2 text-lg font-bold text-red-800">{
                  jsonData.state === 'loading'
                    ? <Spinner size='sm' />
                    : getValue(jsonData.data[name.toLowerCase()].lifetime, measure)
                }</td>
              </tr>)}
            </tbody>
          </table>
        </>)}
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

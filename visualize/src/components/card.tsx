import { PropsWithChildren } from 'react';

export const Card = (props: PropsWithChildren<{ title: string }>) => {
  return <div className='flex-grow p-3 space-y-2 border rounded bg-white'>
    {<p className='text-lg font-bold text-gray-900 border-b px-2'>{props.title}</p>}
    <div className='px-2 space-y-3'>
      {props.children}
    </div>
  </div>
}

import { PropsWithChildren } from 'react';

export const Card = (props: PropsWithChildren<{ title: string }>) => {
  return <div className='w-full sm:w-1/2 xl:w-1/3 p-1 pt-4 space-y-1'>
    {props.children}
    <p className='px-1 text-sm text-gray-700'>{props.title}</p>
  </div>
}

import { PropsWithChildren } from 'react';

export const Card = (props: PropsWithChildren<{ title: string }>) => {
  return <div className='w-[97%] sm:w-[47%] xl:w-[30%] p-3 space-y-2 border'>
    {<p className='text-lg font-bold text-gray-900 border-b px-2'>{props.title}</p>}
    <div className='px-2 space-y-3'>
      {props.children}
    </div>
  </div>
}

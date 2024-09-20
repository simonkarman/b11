import { PropsWithChildren, useRef, useState } from 'react';
import { DataSelectionUi } from '@/components/data-selection-ui';

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export const Card = (props: PropsWithChildren<{ title: string, description: string, isChart?: boolean }>) => {
  const [enlarged, setEnlarged] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);

  return <div className='flex-grow py-2 text-center lg:text-left'>
    <div className='space-y-2'>
      <div className='flex justify-center lg:justify-between items-center border-b border-slate-100 px-2 gap-2'>
        <p className='font-bold text-slate-900 text-lg'>
          {props.title}
        </p>
        {props.isChart &&
          <button className='text-xs' onClick={() => setEnlarged(true)}>
            🔎
          </button>
        }
      </div>
      <div className='flex flex-col items-center lg:items-start px-2 space-y-3'>
        <p className='text-sm text-slate-600'>
          {props.description}
        </p>
        <div className={props.isChart ? 'w-full max-w-[29rem] lg:max-w-full lg:w-[29rem] xl:w-[37rem] 2xl:w-[45rem]': ''}>
          {props.children}
        </div>
      </div>
    </div>
    {enlarged && <div
      ref={backgroundRef}
      className="fixed top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-4 lg:p-8"
      onClick={(e) => {
        if (e.target === backgroundRef.current) {
          setEnlarged(false);
        }
      }}
    >
      <div className="w-full max-h-[95%] rounded-lg border border-slate-300 bg-white p-4 shadow">
        <p className='font-bold text-slate-900 text-lg'>
          {props.title}
        </p>
        <p className='text-sm text-slate-600'>
          {props.description}
        </p>
        <div className='w-full'>
          {props.children}
        </div>
        <DataSelectionUi />
      </div>
    </div>}
  </div>
}

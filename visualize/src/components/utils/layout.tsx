import { DataSelectionUi } from '@/components/data-selection-ui';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [showFilters, setShowFilters] = useState(false);

  return <body className='bg-white flex flex-col min-h-screen'>
  <header
    className="container mx-auto p-4 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left lg:items-end gap-y-3 gap-x-8">
    <div className="flex-shrink-0 pb-1 flex flex-col gap-2 lg:gap-0">
      <h1 className="text-3xl font-bold">B11</h1>
      <p className="text-slate-600 text-sm">
        Analyze and view{' '}
        <a
          target="_blank"
          href="https://svsticky.nl/besturen/11"
          className="text-blue-600"
        >
          B11
        </a>{' '}
        posts at 11:11
      </p>
    </div>
    {showFilters && <DataSelectionUi/>}
    {/*{!showFilters &&*/}
      <button
        className="flex-shrink-0 text-sm text-slate-600 border bg-slate-50 border-slate-200 py-0.5 px-1 rounded hover:bg-slate-100"
        onClick={() => setShowFilters(!showFilters)}
      >
        ⚙️
      </button>
    {/*}*/}
  </header>
  <div className="flex-grow">
    <main className="container mx-auto px-2">
      {children}
    </main>
  </div>
  <footer className="w-full bg-slate-50 border-t border-slate-100">
    <div className="container mx-auto p-2 text-slate-800">
      <p className="text-center text-xs">
        Available on <a
        target="_blank"
        href="https://github.com/simonkarman/b11"
        className="text-blue-500"
      >
        GitHub
      </a>. Created by <a
        target="_blank"
        href="https://simonkarman.nl"
        className="text-blue-500"
      >Simon</a>.
      </p>
    </div>
  </footer>
  </body>;
}
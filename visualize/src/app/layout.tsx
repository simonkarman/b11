import { DataDownloader } from '@/components/utils/data-downloader';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B11',
  description: 'Analyze and view B11 posts on 11:11',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className='bg-gray-200 flex flex-col min-h-screen'>
        <header className='w-full border-b-2 border-gray-300'>
          <div className='container mx-auto p-4'>
            <h1 className='text-xl font-bold'>B11</h1>
            <p>Analyze and view <a
              target='_blank'
              href='https://svsticky.nl/besturen/11'
              className='text-blue-600'
            >B11</a> posts on 11:11.</p>
          </div>
        </header>
        <div className='flex-grow bg-gray-50'>
          <main className='container mx-auto px-2'>
            <DataDownloader>
              {children}
            </DataDownloader>
          </main>
        </div>
      <footer className='w-full border-t-2 border-gray-300'>
        <div className='container mx-auto p-3'>
          <p className='text-center text-sm'>
            [2024] ❤️ <a
              target='_blank'
              href='https://github.com/simonkarman/b11'
              className='text-blue-600'
            >
              GitHub Source
            </a> by <a
              target='_blank'
              href='https://simonkarman.nl'
              className='text-blue-600'
            >Simon Karman</a>.
          </p>
        </div>
      </footer>
      </body>
    </html>
  )
}

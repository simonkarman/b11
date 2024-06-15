import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B11',
  description: 'Analyze and view B11 posts on 11:11',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className='flex flex-col min-h-screen'>
        <header className='bg-gray-100 w-full p-4 border-b-2 border-gray-300'>
          <div className='container mx-auto'>
            <h1 className='text-xl font-bold mb-2'>B11</h1>
            <p>Analyze and view <a
              className='underline text-blue-600'
              href='https://svsticky.nl/besturen/11'
            >B11</a> posts on 11:11.</p>
          </div>
        </header>
        <div className='flex-grow bg-white'>
          <main className='container mx-auto'>
            {children}
          </main>
        </div>
      <footer className='bg-gray-100 w-full p-4 border-t-2 border-gray-300'>
        <div className='container mx-auto'>
          <p>
            Source: <a
              target='_ref'
              href='https://github.com/simonkarman/b11'
              className='text-blue-600'
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
      </body>
    </html>
  )
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B11',
  description: 'Analyze and view b11 posts on 11:11',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className='bg-gray-700'>{children}</body>
    </html>
  )
}

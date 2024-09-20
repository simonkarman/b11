import { DataDownloader } from '@/components/utils/data-downloader';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'B11',
  description: 'Analyze and view B11 posts at 11:11',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <DataDownloader>
        {children}
      </DataDownloader>
    </html>
  )
}

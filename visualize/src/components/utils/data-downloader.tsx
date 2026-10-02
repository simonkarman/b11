import { DataSelector } from '@/components/utils/data-selector';
import { parseDays } from '@/data/days';
import { PropsWithChildren } from 'react';

export async function DataDownloader(props: PropsWithChildren) {
  const dataUrl = 'https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.txt';
  const raw = await fetch(dataUrl, { cache: 'no-store' }).then(response => response.text());
  const data = parseDays(raw);

  return <DataSelector source={data}>
    {props.children}
  </DataSelector>;
}

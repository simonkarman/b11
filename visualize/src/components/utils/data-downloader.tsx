import { DataSelector } from '@/components/utils/data-selector';
import { PropsWithChildren } from 'react';

export const everyone = ['raoul', 'thomas', 'yorick', 'robin', 'simon', 'rogier'] as const;
export const colors = {
  raoul: { rgb: 'rgb(14 116 144)', border: 'border-cyan-700', textClass: 'text-cyan-700', bgClass: 'bg-cyan-700' },
  thomas: { rgb: 'rgb(21 128 61)', border: 'border-green-700', textClass: 'text-green-700', bgClass: 'bg-green-700' },
  yorick: { rgb: 'rgb(67 56 202)', border: 'border-indigo-700', textClass: 'text-indigo-700', bgClass: 'bg-indigo-700' },
  robin: { rgb: 'rgb(126 34 206)', border: 'border-purple-700', textClass: 'text-purple-700', bgClass: 'bg-purple-700' },
  simon: { rgb: 'rgb(180 83 9)', border: 'border-amber-700', textClass: 'text-amber-700', bgClass: 'bg-amber-700' },
  rogier: { rgb: 'rgb(185 28 28)', border: 'border-red-700', textClass: 'text-red-700', bgClass: 'bg-red-700' },
};
export type Person = (typeof everyone)[number];
export type Day = {
  date: string,
  people: Person[]
};

export async function DataDownloader(props: PropsWithChildren) {
  const dataUrl = 'https://raw.githubusercontent.com/simonkarman/b11/main/output/latest.txt';
  const raw = await fetch(dataUrl).then(response => response.text());
  const data: Day[] = raw.split('\n').map((line, lineIndex) => {
    const [date, ...people] = line
      .split(' ')
      .filter(name => !name.startsWith('~'))
      .map(name => name.endsWith(',') ? name.slice(0, -1) : name);

    if (!people.every(name => everyone.includes(name as unknown as Person))) {
      throw new Error(`Invalid name(s) in line ${lineIndex + 1}: ${line}`);
    }

    return {
      date,
      people: people as unknown as Person[],
    };
  });

  return <DataSelector source={data}>
    {props.children}
  </DataSelector>;
}

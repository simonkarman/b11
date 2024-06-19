import { DataSelector } from '@/components/utils/data-selector';
import { PropsWithChildren } from 'react';

export const everyone = ['raoul', 'thomas', 'yorick', 'robin', 'simon', 'rogier'] as const;
export const colors = {
  raoul: { rgb: 'rgb(67 56 202)', className: 'text-indigo-700' },
  thomas: { rgb: 'rgb(21 128 61)', className: 'text-green-700' },
  yorick: { rgb: 'rgb(14 116 144)', className: 'text-cyan-700' },
  robin: { rgb: 'rgb(126 34 206)', className: 'text-purple-700' },
  simon: { rgb: 'rgb(180 83 9)', className: 'text-amber-700' },
  rogier: { rgb: 'rgb(185 28 28)', className: 'text-red-700' },
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

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
export type Day = { date: string; people: Person[] };

export function parseDays(raw: string): Day[] {
  const lines = raw.trim().split('\n');
  if (lines.length === 1 && lines[0] === '') return [];

  return lines.map((line, index) => {
    const [date, ...entries] = line.trim().split(/\s+/);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid date on line ${index + 1}: ${line}`);
    }
    const people: Person[] = [];
    for (const entry of entries) {
      // Keep near misses in latest.txt for inspection, but omit them from the dashboard.
      if (entry.startsWith('~')) continue;
      const name = entry.replace(/,$/, '');
      if (!everyone.includes(name as Person)) {
        throw new Error(`Invalid name on line ${index + 1}: ${line}`);
      }
      people.push(name as Person);
    }
    return { date, people };
  });
}

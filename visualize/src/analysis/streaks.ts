import { Day, Person } from '../data/days';
import { DateTime } from 'luxon';

type Streaks = {
  positive: Record<number, number>;
  negative: Record<number, number>;
  longestPositive: number;
  longestNegative: number;
  currentPositive: number;
  currentNegative: number;
};

// Missing dates and close posts both count as days without an exact 11:11.
// The selected period is inclusive and the final streak is counted.
export function calculateStreaks(days: Day[], startDate: string, endDate: string, person: Person): Streaks {
  const result: Streaks = {
    positive: {}, negative: {}, longestPositive: 0, longestNegative: 0,
    currentPositive: 0, currentNegative: 0,
  };
  if (startDate > endDate) return result;

  const posted = new Set(days.filter(day => day.people.includes(person)).map(day => day.date));
  let length = 0;
  let wasPositive: boolean | undefined;
  const finish = () => {
    if (!length) return;
    const distribution = wasPositive ? result.positive : result.negative;
    distribution[length] = (distribution[length] ?? 0) + 1;
    if (wasPositive) result.longestPositive = Math.max(result.longestPositive, length);
    else result.longestNegative = Math.max(result.longestNegative, length);
  };

  for (let date = DateTime.fromISO(startDate), end = DateTime.fromISO(endDate); date <= end; date = date.plus({ days: 1 })) {
    const positive = posted.has(date.toISODate()!);
    if (wasPositive !== undefined && positive !== wasPositive) {
      finish();
      length = 0;
    }
    wasPositive = positive;
    length++;
  }
  finish();
  if (wasPositive === true) result.currentPositive = length;
  if (wasPositive === false) result.currentNegative = length;
  return result;
}

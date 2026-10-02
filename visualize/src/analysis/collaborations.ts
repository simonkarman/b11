import { Day, Person } from '../data/days';

// Counts are based on exact posts by the selected people only.
export function countCollaborations(days: Day[], people: Person[]) {
  const byPerson = Object.fromEntries(people.map(person => [person, {} as Record<number, number>])) as Record<Person, Record<number, number>>;
  const combinations: Record<string, number> = {};
  for (const day of days) {
    const participants = people.filter(person => day.people.includes(person));
    if (participants.length === 0) continue;
    const group = participants.join('+');
    combinations[group] = (combinations[group] ?? 0) + 1;
    for (const person of participants) {
      byPerson[person][participants.length] = (byPerson[person][participants.length] ?? 0) + 1;
    }
  }
  return { byPerson, combinations };
}

import assert from 'node:assert/strict';
import test from 'node:test';
import { accumulatedContributions, countPosts, selectDays } from '../src/analysis/days';
import { countCollaborations } from '../src/analysis/collaborations';
import { calculateStreaks } from '../src/analysis/streaks';
import { parseDays } from '../src/data/days';

const days = parseDays('2024-01-01 raoul, ~simon\n2024-01-02 raoul, simon\n2024-01-04 simon\n');

test('parsing ignores near misses and selected days retain the chosen people', () => {
  assert.deepEqual(days[0], { date: '2024-01-01', people: ['raoul'] });
  assert.deepEqual(selectDays(days, '2024-01-02', '2024-01-04', ['simon']), [
    { date: '2024-01-02', people: ['simon'] },
    { date: '2024-01-04', people: ['simon'] },
  ]);
  assert.equal(countPosts(days, ['simon']).simon, 2);
});

test('streaks count missing dates and close posts as misses and include the end boundary', () => {
  const raoul = calculateStreaks(days, '2024-01-01', '2024-01-04', 'raoul');
  assert.deepEqual(raoul.positive, { 2: 1 });
  assert.deepEqual(raoul.negative, { 2: 1 });
  assert.equal(raoul.currentNegative, 2);

  const simon = calculateStreaks(days, '2024-01-01', '2024-01-04', 'simon');
  assert.deepEqual(simon.positive, { 1: 2 });
  assert.deepEqual(simon.negative, { 1: 2 });
  assert.equal(simon.currentPositive, 1);
});

test('collaborations and chart totals use exact posts from the selected people', () => {
  assert.deepEqual(countCollaborations(days, ['simon', 'raoul']).combinations, {
    raoul: 1, 'simon+raoul': 1, simon: 1,
  });
  const progress = accumulatedContributions(days, 'monthly', ['raoul', 'simon']);
  assert.equal(progress.length, 1);
  assert.equal(progress[0].raoul, 2);
  assert.equal(progress[0].simon, 2);
});

import { DateTimeUnit } from 'luxon';

export const granularities = ['yearly', 'quarterly', 'monthly', 'weekly', 'daily'] as const;
export type Granularity = typeof granularities[number];

export const granularityToFormat = (granularity: Granularity) => ({
  yearly: 'yyyy',
  quarterly: "'Q'q - yyyy",
  monthly: 'LLL yyyy',
  weekly: "'Week' W - yyyy",
  daily: 'yyyy-MM-dd',
})[granularity];

export const granularityToDateTimeUnit = (granularity: Granularity): DateTimeUnit => ({
  yearly: 'year',
  quarterly: 'quarter',
  monthly: 'month',
  weekly: 'week',
  daily: 'day',
})[granularity] as DateTimeUnit;

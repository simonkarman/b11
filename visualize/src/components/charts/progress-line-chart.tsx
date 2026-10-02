"use client";

import { capitalize } from '@/components/card';
import { accumulatedContributions } from '@/analysis/days';
import { useSelectedData } from '@/components/utils/data-selector';
import { LineChart } from '@/components/utils/line-chart';
import { useMemo } from 'react';

export const ProgressLineChart = () => {
  const { days, granularity: _granularity, people } = useSelectedData();
  const granularity = _granularity ?? 'daily';
  const data = useMemo(() => accumulatedContributions(days, granularity, people), [days, granularity, people]);
  return <LineChart
    title={'Progress'}
    description={`${capitalize(granularity)} accumulative progress per person.`}
    data={data}
  ></LineChart>
}

"use client";

import { ContributionBarChart } from '@/components/charts/contribution-bar-chart';
import { OverallTable } from '@/components/charts/overall-table';
import { ProgressLineChart } from '@/components/charts/progress-line-chart';
import { DataSelectionUi } from '@/components/data-selection-ui';

export default function Home() {
  return (<>
    <div className='w-full justify-between flex flex-wrap py-2 gap-2'>
      <DataSelectionUi />
      <OverallTable />
      <ProgressLineChart />
      <ContributionBarChart />
    </div>
  </>);
}

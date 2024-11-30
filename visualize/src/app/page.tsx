"use client";

import { ContributionBarChart } from '@/components/charts/contribution-bar-chart';
import { OverallTable } from '@/components/charts/overall-table';
import { ProgressLineChart } from '@/components/charts/progress-line-chart';
import { Layout } from '@/components/utils/layout';
import { FunFacts } from '@/components/charts/fun-facts';

export default function Home() {
  return (<Layout>
    <div className='w-full flex flex-col lg:flex-row flex-wrap justify-between py-2 gap-5'>
      <OverallTable/>
      <ProgressLineChart/>
      <ContributionBarChart/>
      <FunFacts/>
    </div>
  </Layout>);
}

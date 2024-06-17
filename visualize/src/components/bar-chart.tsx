"use client";

import { Card } from '@/components/card';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

export const BarChart = () => {
  const [data, setData] = useState([
    {
      name: 'A',
      value: 50,
    },
    {
      name: 'B',
      value: 20,
    },
    {
      name: 'C',
      value: 40,
    },
    {
      name: 'D',
      value: 100,
    },
  ]);
  // @ts-ignore
  const svgRef: any = useRef<SVGSVGElement>();

  useEffect(() => {
    // const margin = {top: 20, right: 20, bottom: 30, left: 40};
    // const width = 960 - margin.left - margin.right;
    // const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleBand().range([0, 100]).padding(0.1);
    const y = d3.scaleLinear().range([100, 0]);

    const svg = d3
      // @ts-ignore
      .select(svgRef.current)
      .append('svg')
      // .attr('width', width + margin.left + margin.right)
      // .attr('height', height + margin.top + margin.bottom)
      .append('g');
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(
      data.map(function (d) {
        return d.name;
      }),
    );
    // @ts-ignore
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      // @ts-ignore
      .attr('x', function (d) {
        const xd = x(d.name) ?? 0;
        return xd + 10;
      })
      .attr('width', x.bandwidth())
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('height', function (d) {
        return 100 - y(d.value);
      });

    svg
      .append('g')
      .attr('transform', 'translate(10,' + 100 + ')')
      .call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));
  }, [data]);

  // @ts-ignore
  return (
    <Card title={'An Examble Bar Chart'} >
      <svg className='w-full' ref={svgRef} />
    </Card>
  );
}

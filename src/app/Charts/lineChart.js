import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function RenderLineChart() {
  const [data] = useState([300, 125, 200, 250, 100, 75, 25, 215, 165, 201, 34]);
  const svgRef = useRef();

  useEffect(() => {
    const w = 500;
    const h = 350;
    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height', h)
                  .style('overflow', 'visible')
                  .style('margin-top', '20px')
                  .style('margin-bottom', '20px');

    const xScale = d3.scaleLinear()
                     .domain([0, data.length - 1])
                     .range([0, w]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data)])
                     .range([h, 0]);

    const line = d3.line()
                   .x((d, i) => xScale(i))
                   .y(d => yScale(d));

    svg.append('path')
       .datum(data)
       .attr('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line);

    // Define another dataset for the second line
    const data2 = [50, 150, 100, 200, 250, 175, 125, 275, 225, 150, 100];

    const line2 = d3.line()
                    .x((d, i) => xScale(i))
                    .y(d => yScale(d))
                    .curve(d3.curveMonotoneX); // Add curve for smooth line

    svg.append('path')
       .datum(data2)
       .attr('fill', 'none')
       .attr('stroke', 'red')
       .attr('stroke-width', 2)
       .attr('d', line2);

    const xAxis = d3.axisBottom(xScale)
                    .ticks(data.length);

    const yAxis = d3.axisLeft(yScale)
                    .ticks(6);

    svg.append('g')
       .call(xAxis)
       .attr('transform', `translate(0, ${h})`);

    svg.append('g')
       .call(yAxis);

    // Adding legend
    svg.append('text')
       .attr('x', 10)
       .attr('y', 325)
       .attr('fill', 'steelblue')
       .text('Income');

    svg.append('text')
       .attr('x', 10)
       .attr('y', 340)
       .attr('fill', 'red')
       .text('Expenses');

  }, [data]);


  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

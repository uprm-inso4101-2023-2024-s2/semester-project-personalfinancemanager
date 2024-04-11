import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

/**
 * Functional component for rendering a line chart using D3.js.
 */
export default function RenderLineChart() {
  // State hook to manage data
  const [data] = useState([300, 125, 200, 250, 100, 75, 25, 215, 165, 201, 34]);
  // Reference hook for SVG element
  const svgRef = useRef();

  useEffect(() => {
    // Chart dimensions and margins
    const w = 600; // Increased width to accommodate legend
    const h = 350;
    const margin = { top: 20, right: 80, bottom: 50, left: 50 }; // Increased right margin for legend
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;

    // SVG element selection and styling
    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height', h)
                  .style('overflow', 'visible')
                  .style('margin-top', '20px')
                  .style('margin-bottom', '20px');

    // X and Y scales
    const xScale = d3.scaleLinear()
                     .domain([0, data.length - 1])
                     .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data)]) 
                     .range([innerHeight, 0]);

    // Line generator
    const line = d3.line()
                   .x((d, i) => xScale(i))
                   .y(d => yScale(d));

    // X and Y axes
    const xAxis = d3.axisBottom(xScale)
                  .ticks(data.length);

    const yAxis = d3.axisLeft(yScale)
                  .ticks(6);

    const xAxisGroup = svg.append('g')
                          .call(xAxis)
                          .attr('transform', `translate(${margin.left}, ${margin.top + innerHeight})`);

    const yAxisGroup = svg.append('g')
                          .call(yAxis)
                          .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Increase font size of ticks
    xAxisGroup.selectAll('text')
              .attr('font-size', '12px');

    yAxisGroup.selectAll('text')
              .attr('font-size', '12px');

    // Adding horizontal grid lines
    yAxisGroup.selectAll('g.tick')
              .append('line')
              .attr('class', 'grid-line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', innerWidth)
              .attr('y2', 0)
              .style('stroke', 'gray')
              .style('stroke-width', '1px')
              .style('opacity', '0.1');

    // Adding vertical grid lines
    xAxisGroup.selectAll('g.tick')
              .append('line')
              .attr('class', 'grid-line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', 0)
              .attr('y2', -innerHeight)
              .style('stroke', 'gray')
              .style('stroke-width', '1px')
              .style('opacity', '0.1');

    // Render first line
    svg.append('path')
       .datum(data)
       .attr('fill', 'none')
       .attr('stroke', 'steelblue')
       .attr('stroke-width', 2)
       .attr('d', line)
       .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define another dataset for the second line
    const data2 = [50, 150, 100, 200, 250, 175, 125, 275, 225, 150, 100];

    // Line generator for the second line
    const line2 = d3.line()
                    .x((d, i) => xScale(i))
                    .y(d => yScale(d))

    // Render second line
    svg.append('path')
       .datum(data2)
       .attr('fill', 'none')
       .attr('stroke', 'red')
       .attr('stroke-width', 2)
       .attr('d', line2)
       .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Adding legend
    const legend = svg.append('g')
                      .attr('transform', `translate(${innerWidth + margin.left + 10}, ${margin.top})`);

    legend.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', 'steelblue');

    legend.append('text')
          .attr('x', 15)
          .attr('y', 11)
          .attr('fill', 'black')
          .text('Income');

    legend.append('rect')
          .attr('x', 0)
          .attr('y', 20)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', 'red');

    legend.append('text')
          .attr('x', 15)
          .attr('y', 31)
          .attr('fill', 'black')
          .text('Expenses');

  }, [data]);

  // JSX return
  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

'use client'
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';

export default function RenderBarChart() {
  const [data] = useState([300, 125, 200, 250, 100, 75, 25, 215, 165, 201, 34]);
  const svgRef = useRef();

  useEffect(() => {
    //setting the container
    const w = 500;
    const h = 350;
    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height',h)
                  .style('overflow', 'visible')
                  .style('margin-top', '75px');
    //setting the scaling
    const xScale = d3.scaleBand()
                .domain(data.map((val, i) => i))
                .range([0,w])
                .padding(0.5);
    const yScale = d3.scaleLinear()
                .domain([0,h])
                .range([h, 0]);
    //setting the axes
    const xAxis = d3.axisBottom(xScale)
                    .ticks(data.length);
    const yAxis = d3.axisLeft(yScale)
                    .ticks(6);
    svg.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,' + h + ')');
    svg.append('g')
      .call(yAxis);
    //seting the svg data
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', (v, i) => xScale(i))
      .attr('y', yScale)
      .attr('width', xScale.bandwidth())
      .attr('height', val => h - yScale(val));

  }, [data]);


  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}
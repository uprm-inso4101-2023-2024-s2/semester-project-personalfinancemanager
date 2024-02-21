'use client'
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';

export default function RenderBarChart() {
  const [data] = useState([
    { value: 300, name: "Yaira" },
    { value: 125, name: "Samantha" },
    { value: 200, name: "Lisa" },
    { value: 250, name: "Angelica" },
    { value: 100, name: "Mathew" },
    { value: 75, name: "Luis" },
    { value: 25, name: "Fernando" },
    { value: 215, name: "Angel" },
    { value: 165, name: "Rosa" },
    { value: 201, name: "Michael" },
    { value: 34, name: "John" }
  ]);
  const svgRef = useRef();

  useEffect(() => {
    //setting the container
    const w = 500;
    const h = 350;
    const paddingTop = 20;
    const paddingBottom = 20;
    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height',h)
                  .style('overflow', 'visible')
                  .style('margin-top', '20px')
                  .style('margin-bottom', '20px');
    //setting the scaling
    const xScale = d3.scaleBand()
                .domain(data.map((val, i) => val.name))
                .range([0,w])
                .padding(0.5);
    const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value) + paddingTop] )
                .range([h, 0]);
    //setting the axes
    const xAxis = d3.axisBottom(xScale)
                    .ticks(data.length);
    const yAxis = d3.axisLeft(yScale)
                    .ticks(25);
    svg.append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,' + (h) + ')');
    svg.append('g')
      .call(yAxis);
    //seting the svg data
    svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => h - yScale(d.value))
      .style('fill', "#8db0c7");

  }, [data]);


  return (
    <div className="barChart">
      <svg ref={svgRef}></svg>
    </div>
  );
}
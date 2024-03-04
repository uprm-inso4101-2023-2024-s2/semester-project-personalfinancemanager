import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RenderPieChart = ({ expensesData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
      .value(d => d.total);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(expensesData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d3.schemeCategory10[i]);

    const legend = svg.selectAll(".legend")
      .data(expensesData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width / 2 + 20},${i * 30 + 20})`);

    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => d3.schemeCategory10[i]);

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .style("fill", "#8db0c7")
      .text(d => d.title);
  }, [expensesData]);

  return (
    <div className="pie-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RenderPieChart;

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './globals.css';

const RenderPieChart = ({ expensesData }) => {
  const svgRef = useRef();

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove();

    const colorScale = d3.scaleOrdinal().range(expensesData.map(d => d.color));

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    svg.selectAll("text").remove();

    const totalText = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "#333")
      .style("font-size", "16px");

    const percentageText = svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em");

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const updateTotalText = (total, category, amount) => {
        const textY = 0;
      
        if (category && amount !== 0) {
          const percentage = ((amount / total) * 100).toFixed(2);
          const categoryColor = colorScale(category);
          percentageText.text(`${percentage}%`)
            .style("fill", categoryColor)
            .style("font-size", "20px")
            .attr("dy", `${textY}em`);
          totalText.text("");
        } else {
          totalText.text(`Total: $${total.toFixed(2)}`)
            .attr("dy", `${textY}em`);
          percentageText.text("");
        }
    };

    const pie = d3.pie()
      .value(d => d.total);

    const arc = d3.arc()
      .innerRadius(radius - 80)
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(expensesData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.title))
      .on("mousemove", function (event, d) {
        const originalColor = colorScale(d.data.title);
        const brighterColor = d3.color(originalColor).brighter();
      
        d3.select(this)
          .transition()
          .duration(100)
          .attr("fill", brighterColor);
      
        const totalAmount = d3.sum(expensesData, (d) => d.total);
        const categoryAmount = d.data.total;
        const categoryName = d.data.title;
      
        updateTotalText(totalAmount, categoryName, categoryAmount);
      
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      
        tooltip.html(`${categoryName}: $${categoryAmount.toFixed(2)}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function (event, d) {
        const originalColor = colorScale(d.data.title);
      
        d3.select(this)
          .transition()
          .duration(100)
          .attr("fill", originalColor);
      
        updateTotalText(d3.sum(expensesData, (d) => d.total), '', 0);
      
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

  }, [expensesData]);

  return (
    <div className="pie-chart" style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default RenderPieChart;


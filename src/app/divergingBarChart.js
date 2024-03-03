'use client'
import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';

export default function RenderDBC( {
    data = [],
    x = d => d.value, // given d in data, returns the (quantitative) x-value
    y = d => d.category, // given d in data, returns the (ordinal) y-value
    marginTop = 50, 
    marginRight = 40, 
    marginBottom = 10, 
    marginLeft = 40, 
    width = 640, // outer width of chart, in pixels
    height, // the outer height of the chart, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.1, 
    yRange, // [top, bottom]
    colors = ["red", "steelblue"] // [negative, …, positive] colors
  } = {}) {
    // Compute values.
    const svgRef = useRef();

    useEffect(() => {
        d3.select(svgRef.current).selectAll('*').remove();

        const X = d3.map(data, x);
        const Y = d3.map(data, y);
    
        // Compute default domains, and unique the y-domain.
        const xDomain = d3.extent(X);
        let yDomain = Y;
        yDomain = Array.from(new Set(yDomain));
    
        // Omit any data not present in the y-domain.
        // Lookup the x-value for a given y-value.
        const I = d3.range(X.length).filter(i => yDomain.includes(Y[i]));
        const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);
    
        // Compute the default height.
        const height = Math.ceil((yDomain.length + yPadding) * 25) + marginTop + marginBottom;
        const yRange = [marginTop, height - marginBottom];
    
        // Construct scales, axes, and formats.
        const xScale = xType().domain(xDomain).range(xRange);
        const yScale = d3.scaleBand().domain(yDomain).range(yRange).padding(yPadding);
        const xAxis = d3.axisTop(xScale).ticks(width / 80).tickFormat(xFormat);
        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
        const format = xScale.tickFormat(100, xFormat);
    
    
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .style('margin-bottom', '20px')
            .style('margin-top', '20px');
    
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", xScale(0))
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "center")
                .text(xLabel));
    
        const bar = svg.append('g')
            .selectAll('rect')
            .data(I)
            .join('rect')
            .attr('fill', i => colors[X[i] > 0 ? colors.length - 1 : 0])
            .attr('x', i => xScale(0))
            .attr('y', i => yScale(Y[i]))
            .attr('height', yScale.bandwidth()) 
            .attr('width', 0) 
            .on('mouseover', function(event, i) {
                d3.select(this)
                  .attr('fill', 'orange')
                
                svg.selectAll("text")
                  .filter(d => d === Y[i])
                  .transition()
                  .duration(300)
                  .attr("font-size", "16px");
            })
            .on('mouseout', function(event, i) {
                d3.select(this)
                  .attr('fill', i => colors[X[i] > 0 ? colors.length - 1 : 0])
    
                  svg.selectAll('text')
                  .filter(d => d === Y[i])
                  .transition()
                  .duration(300)
                  .attr("font-size", "10px");
            })
            .transition() 
            .duration(500) 
            .attr('width', i => Math.abs(xScale(X[i]) - xScale(0)))
            .attr('x', i => Math.min(xScale(0), xScale(X[i])));
    
        svg.append("g")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(I)
            .join("text")
            .attr("text-anchor", i => X[i] < 0 ? "end" : "start")
            .attr("x", i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
            .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("fill", "#808080")
            .text(i => format(X[i]));
    
        svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(yAxis)
            .call(g => g.selectAll(".tick text")
                .filter(y => YX.get(y) < 0)
                .attr("text-anchor", "start")
                .attr("x", 6));
    }, [data, height, width, xRange, yRange, xLabel, xFormat, xType, marginTop, marginRight, marginBottom, marginLeft, yPadding, colors]);
    
    return (
        <div className="divergingBarChart">
            <svg ref={svgRef}></svg>
        </div>
    );
}
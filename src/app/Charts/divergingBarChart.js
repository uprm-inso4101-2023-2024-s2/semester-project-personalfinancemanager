'use client'
import React, {useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';

export default function RenderDBC( {
    x = d => d.value, // given d in data, returns the (quantitative) x-value
    y = d => d.category, // given d in data, returns the (ordinal) y-value
    title, // given d in data, returns the title text
    marginTop = 50, 
    marginRight = 40, 
    marginBottom = 10, 
    marginLeft = 40, 
    width = 640, // outer width of chart, in pixels
    height, // the outer height of the chart, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.1, 
    yDomain, // an array of (ordinal) y-values
    yRange, // [top, bottom]
    colors = ["red", "steelblue"] // [negative, …, positive] colors
  } = {}) {
    // Compute values.
    const [data] = useState([
        { value: 300, category: "Jobs" },
        { value: -125, category: "Bank" },
        { value: -200, category: "Car" },
        { value: 250, category: "Properties" },
        { value: 100, category: "Stocks" },
        { value: -75, category: "Jewelry" },
        { value: 25, category: "Betting" },
        { value: -180, category: "Food" },
        { value: -80, category: "House" },
        { value: 201, category: "Bonds" },
        { value: 34, category: "Investments" }
      ]);
    const svgRef = useRef();

    useEffect(() => {
        const X = d3.map(data, x);
        const Y = d3.map(data, y);
    
        // Compute default domains, and unique the y-domain.
        let xDomainComputed = xDomain;
        if (xDomainComputed === undefined) xDomainComputed = d3.extent(X);
        let yDomainComputed = yDomain;
        if (yDomainComputed === undefined) yDomainComputed = Y;
        yDomainComputed = Array.from(new Set(yDomainComputed));
    
        // Omit any data not present in the y-domain.
        // Lookup the x-value for a given y-value.
        const I = d3.range(X.length).filter(i => yDomainComputed.includes(Y[i]));
        const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);
    
        // Compute the default height.
        let heightComputed = height;
        if (heightComputed === undefined) heightComputed = Math.ceil((yDomainComputed.length + yPadding) * 25) + marginTop + marginBottom;
        let yRangeComputed = yRange;
        if (yRangeComputed === undefined) yRangeComputed = [marginTop, heightComputed - marginBottom];
    
        // Construct scales, axes, and formats.
        const xScale = xType().domain(xDomainComputed).range(xRange);
        const yScale = d3.scaleBand().domain(yDomainComputed).range(yRangeComputed).padding(yPadding);
        const xAxis = d3.axisTop(xScale).ticks(width / 80).tickFormat(xFormat);
        const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(6);
        const format = xScale.tickFormat(100, xFormat);
    
        // Compute titles.
        let titleFunction = null;
        if (title === undefined) {
            titleFunction = i => `${data[i].category}\n${format(X[i])}`;
        } else if (title !== null) {
            const O = d3.map(data, d => d);
            titleFunction = i => title(O[i], i, data);
        }
    
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", heightComputed)
            .attr("viewBox", [0, 0, width, heightComputed])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .style('margin-bottom', '20px')
            .style('margin-top', '20px');
    
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", heightComputed - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", xScale(0))
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "center")
                .text(xLabel));
    
        const bar = svg.append("g")
            .selectAll("rect")
            .data(I)
            .join("rect")
            .attr("fill", i => colors[X[i] > 0 ? colors.length - 1 : 0])
            .attr("x", i => Math.min(xScale(0), xScale(X[i])))
            .attr("y", i => yScale(Y[i]))
            .attr("width", i => Math.abs(xScale(X[i]) - xScale(0)))
            .attr("height", yScale.bandwidth());
    
        if (titleFunction) {
            bar.append("title")
                .text((_, i) => titleFunction(i));
        }
    
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
    }, [data, xDomain, yDomain, height, width, xRange, yRange, xLabel, xFormat, xType, marginTop, marginRight, marginBottom, marginLeft, yPadding, title, colors]);
    
    return (
        <div className="divergingBarChart">
            <svg ref={svgRef}></svg>
        </div>
    );
}
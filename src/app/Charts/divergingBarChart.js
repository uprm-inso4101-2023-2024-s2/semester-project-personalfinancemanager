'use client'
import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import monthlyExpensefilter , { monthlyIncomeFilter, yearlyExpenseFilter, yearlyIncomeFilter } from '../Page-Functionality/Filters/moneyFilters';
import './charts.css';

/**
 * Constructs a Diverging Bar Chart using an array of objects, each with a value and category. 
 * Negative and positive values are displayed on opposite directions. All values
 * except the data parameter have preset values.
 * 
 * @see https://react.dev/reference/react/useRef
 * @see https://react.dev/reference/react/useEffect
 * @see https://d3js.org
 * 
 * @param {Array} expensesData - An array of expenses with each data point holding a value and a category.
 * @param {Array} incomeData - An array of income with each data point holding a value and a description.
 * @param {number} [marginTop=50] - The margin on the top of the chart.
 * @param {number} [marginRight=40] - The margin on the right side of the chart.
 * @param {number} [marginBottom=10] - The margin on the bottom of the chart.
 * @param {number} [marginLeft=40] - The margin on the left side of the chart.
 * @param {number} [width=640] - The width of the chart.
 * @param {string} xFormat - A format specifier string for the x-axis.
 * @param {string} xLabel - A label for the x-axis.
 * @param {number} [yPadding=0.1] - The padding between y-values (categories) in the chart.
 * @param {Array} [colors=["red", "steelblue"]] - An array of colors for pos and neg values.
 * @returns A div containing an svg element with the drawing of the dynamic bar chart svg.
 */
export default function RenderDBC( {
    expensesData = [],
    incomeData = [],
    x = d => d.value, // given d in data, returns the (quantitative) x-value
    y = d => d.category, // given d in data, returns the (ordinal) y-value
    marginTop = 50, 
    marginRight = 70, 
    marginBottom = 10, 
    marginLeft = 70, 
    width = 640, // outer width of chart, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xRange = [marginLeft, width - marginRight], // [left, right]
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    yPadding = 0.1, 
    colors = ["red", "steelblue"] // [negative, …, positive] colors
  } = {}) {
    // Compute values.
    const svgRef = useRef();
    const [currentDate, setCurrentDate,] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [noDataAvailable, setNoDataAvailable] = useState(false);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
    useEffect(() => {
      let updatedFilteredExpenses = [];
      let updatedFilteredIncome = [];
      if(selectedMonth === 0) {
        updatedFilteredExpenses = yearlyExpenseFilter(expensesData, currentDate.getFullYear());
        updatedFilteredIncome = yearlyIncomeFilter(incomeData, currentDate.getFullYear());
      } else {
        updatedFilteredExpenses = monthlyExpensefilter(expensesData, selectedMonth, currentDate.getFullYear());
        updatedFilteredIncome = monthlyIncomeFilter(incomeData, selectedMonth, currentDate.getFullYear());
      }
      setFilteredExpenses(updatedFilteredExpenses);
      setFilteredIncome(updatedFilteredIncome);
    }, [expensesData, incomeData, selectedMonth, currentDate]) 

    const handleChangeMonth = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "0") {
          const year = parseInt(selectedValue);
          setSelectedMonth(year);
          setFilteredExpenses(yearlyExpenseFilter(expensesData, currentDate.getFullYear()));
          setFilteredIncome(yearlyIncomeFilter(incomeData, currentDate.getFullYear()));
        } else {
          // For other months, enable filtering and set the selected month
          const selectedMonth = parseInt(selectedValue);
          setSelectedMonth(selectedMonth);
          setFilteredExpenses(monthlyExpensefilter(expensesData, selectedMonth, currentDate.getFullYear()));
          setFilteredIncome(monthlyIncomeFilter(incomeData, selectedMonth, currentDate.getFullYear()));
        }
      };

      const renderNoDataMessage = () => {
        if (noDataAvailable) {
          return (
            <div className="no-data-message">
              <h3>No information available for {selectedMonth === 0 ? currentDate.getFullYear() : months[selectedMonth - 1]}</h3>
            </div>
          );
        } else {
          return (
            <svg ref={svgRef}></svg>
          );
        }
      };

    const unduplicatedData = {};
    filteredExpenses.forEach(item => {
        if(item.items && item.items.length > 0) {
          const category = item.title;
        if(!unduplicatedData[category]){
            unduplicatedData[category] = -item.total;
        } else {
            unduplicatedData[category] -= item.total;
        }
      }
    })

    filteredIncome.forEach(item => {
        const category = item.description;
        if(!unduplicatedData[category]){
            unduplicatedData[category] = item.amount;
        } else {
            unduplicatedData[category] += item.amount;
        }
    })

    const processedData = Object.keys(unduplicatedData).map(category => ({category, value: unduplicatedData[category]}));
    const total = processedData.reduce((acc, curr) => acc + curr.value, 0);
    processedData.push({category: "Total", value: total});

    useEffect(() => {
        d3.select(svgRef.current).selectAll('*').remove();

        const X = d3.map(processedData, x);
        const Y = d3.map(processedData, y);
    
        // Compute default domains, and unique the y-domain.
        const xDomain = [
          Math.min(0, d3.min(processedData, d => d.value)),
          Math.max(0, d3.max(processedData, d => d.value))
        ];
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
    
        //Create the SVG.
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
            .style('margin-bottom', '20px')
            .style('margin-top', '20px');
    
        //Draw the X-axis.
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove()
                .attr("y2", height - marginTop - marginBottom)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", xScale(0))
                .attr("y", -22)
                .attr("fill", "currentColor")
                .attr("text-anchor", "center")
                .text(xLabel));
        
        //Draw the bars
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

                svg.selectAll(".bar-values")
                   .filter((d, index) => index === i)
                   .transition()
                   .duration(300)
                   .text( i => "$" + format(X[i]))
                   .attr("fill", X[i] < 0 ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)")
                   .attr("font-size", "16");
            })
            .on('mouseout', function(event, i) {
                d3.select(this)
                  .attr('fill', i => colors[X[i] > 0 ? colors.length - 1 : 0])
    
                  svg.selectAll('text')
                  .filter(d => d === Y[i])
                  .transition()
                  .duration(300)
                  .attr("font-size", "10px");

                  svg.selectAll(".bar-values")
                   .filter((d, index) => index === i)
                   .transition()
                   .duration(300)
                   .attr("fill", "#808080")
                   .text(i => format(X[i]))
                   .attr("font-size", "10");
            })
            .transition() 
            .duration(500) 
            .attr('width', i => Math.abs(xScale(X[i]) - xScale(0)))
            .attr('x', i => Math.min(xScale(0), xScale(X[i])));

            //Add individual bar values.
            svg.append("g")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(I)
            .join("text")
            .attr("class", "bar-values")
            .attr("text-anchor", i => X[i] < 0 ? "end" : "start")
            .attr("x", i => xScale(X[i]) + Math.sign(X[i] - 0) * 4)
            .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("fill", "#808080")
            .text(i => format(X[i]));
    
        //Draw the bar labels. 
        svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .attr("class", "bar-labels")
            .call(yAxis)
            .call(g => g.selectAll(".tick text")
                .filter(y => YX.get(y) < 0)
                .attr("text-anchor", "start")
                .attr("x", 6));
        const newDataAvailable = filteredExpenses.length > 0 || filteredIncome.length > 0;
        setNoDataAvailable(!newDataAvailable);
    }, [filteredExpenses, filteredIncome, expensesData, incomeData, handleChangeMonth, width, xRange,  xLabel, xFormat, xType, marginTop, marginRight, marginBottom, marginLeft, yPadding, colors]);
         
    const renderMonthSelector = () => {
      return (
        <div className='month-selector-panel bar'>
          <select className='select-input' name='months' id='months' onChange={handleChangeMonth} value={selectedMonth}>
            <option value="0">{new Date().getFullYear().toString()}</option>
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>{month}</option>
            ))}
          </select>
        </div>
      );
    };

    return (
        <div className="divergingBarChart">
            {renderMonthSelector()}
            {renderNoDataMessage()}
        </div>
    );
}
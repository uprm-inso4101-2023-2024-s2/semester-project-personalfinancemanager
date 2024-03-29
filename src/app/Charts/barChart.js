'use client'
import { financeContext } from '../Finance-Context/finance-context';
import React, {useState, useRef, useEffect} from 'react';
import monthlyExpensefilter from '../Page-Functionality/Filters/moneyFilters';
import * as d3 from 'd3';

const RenderBarChart = ({expensesData}) => {
  const svgRef = useRef();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);

  function hexToRGBA(hex, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  useEffect(() => {
    const filteredExpenses = monthlyExpensefilter(expensesData, selectedMonth, currentTime.getFullYear());

    //checks for whether the expenses were updated
    if(!filteredExpenses || filteredExpenses.length === 0) 
        return;
    
    //deletes previous bars
    d3.select(svgRef.current).selectAll('*').remove();

    //setting the container
    const w = 500;
    const h = 350;
    const paddingTop = 20;
    const paddingBottom = 20;
    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + curr.total, 0);

    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height',h)
                  .style('overflow', 'visible')
                  .style('margin-top', '20px')
                  .style('margin-bottom', '20px');
      //setting the scaling
      const xScale = d3.scaleBand()
                  .domain(filteredExpenses.map((val, i) => val.title))
                  .range([0,w])
                  .padding(0.5);
      const yScale = d3.scaleLinear()
                  .domain([0, d3.max(filteredExpenses, d => d.total)])
                  .range([h, 0]);
      //setting the axes
      const xAxis = d3.axisBottom(xScale)
                  .ticks(filteredExpenses.length);
      const yAxis = d3.axisLeft(yScale)
                  .ticks(25);
      svg.append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + (h) + ')');
      svg.append('g')
        .call(yAxis);
        
      //seting the svg data
      svg.selectAll('.bar')
        .data(filteredExpenses)
        .join('rect')
        .attr('x', d => xScale(d.title))
        .attr('y', d => yScale(d.total))
        .attr('width', xScale.bandwidth())
        .attr('height', d => h - yScale(d.total))
        .style('fill', d => d.color)

        .on('mouseover', function(event, d) {
          d3.select(this)
          .style('fill', d.color)
          .transition()
          .duration(150)
          .style('fill', d => hexToRGBA(d.color, 0.5));
          const valueText = svg.append('text')
            .attr('x', xScale(d.title) + xScale.bandwidth() / 2)
            .attr('y', yScale(d.total) - 5)
            .attr('text-anchor', 'middle')
            .text(d.total)
            .style('font-size', '12px')
            .style('fill', 'white')
            .attr('class', 'valueText')
            .style('opacity', 0) 
            .transition()
            .duration(150) 
            .style('opacity', 1); 
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
          .style('fill', d => hexToRGBA(d.color, 0.5))
          .transition()
          .duration(150)
          .style('fill', d => d.color);
          svg.selectAll('.valueText')
            .transition()
            .duration(150) 
            .style('opacity', 0) 
            .remove(); 
        });
  }, [expensesData, selectedMonth]);

  const handleChangeMonth = (event) => {
    const selectedMonth = parseInt(event.target.value);
    setSelectedMonth(selectedMonth);
  };

  const renderMonthSelector = () => {
    return (
      <div className='month-selector-panel'>
        <select className='select-input' name='months' id='months' onChange={handleChangeMonth} value={selectedMonth}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
    );
  };


  return (
    <div className="barChart">
      {renderMonthSelector()}
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default RenderBarChart;
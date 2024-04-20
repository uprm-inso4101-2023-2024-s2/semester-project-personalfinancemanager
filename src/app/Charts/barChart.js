'use client'
import { financeContext } from '../Finance-Context/finance-context';
import React, {useState, useRef, useEffect} from 'react';
import monthlyExpensefilter from '../Page-Functionality/Filters/moneyFilters';
import { monthlyIncomeFilter } from '../Page-Functionality/Filters/moneyFilters';
import { yearlyExpenseFilter } from '../Page-Functionality/Filters/moneyFilters';
import { yearlyIncomeFilter } from '../Page-Functionality/Filters/moneyFilters';
import * as d3 from 'd3';
import { faL } from '@fortawesome/free-solid-svg-icons';
import './charts.css';

const RenderBarChart = ({ expensesData, incomeData }) => {
  const svgRef = useRef();
  const [showBarChart, setShowBarChart] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(''); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()+1);
  const [shouldFilterByMonth, setShouldFilterByMonth] = useState(true);
  const [shouldFilterByYear, setShouldFilterByYear] = useState(false);
  const [viewIncome, setViewIncome] = useState(false);

  useEffect(() => {  
    let filteredData = viewIncome ? incomeData : expensesData; 

    console.log("Income?: ",viewIncome);
    console.log("Income: ",incomeData);
    console.log("Expenses: ",expensesData);
    console.log("Filtered: ",filteredData);

    //determine whether it should filter the expenses or not and by month or year
    if (shouldFilterByMonth) {
      if (viewIncome) {
        const incomeFilter = monthlyIncomeFilter(incomeData, selectedMonth, currentTime.getFullYear());
        filteredData = aggregateIncomeData(incomeFilter);
      }
      else {
        filteredData = monthlyExpensefilter(expensesData, selectedMonth, currentTime.getFullYear());
      }
    }
    else {
      if (viewIncome) {
        const incomeFilter = yearlyIncomeFilter(incomeData, currentTime.getFullYear());
        filteredData = aggregateIncomeData(incomeFilter);
      }
      else {
        filteredData = yearlyExpenseFilter(expensesData, currentTime.getFullYear());
      }
    }
    //checks if user has no expenses for the selected period
    let totalExpense = 0;
    for (let i = 0; i < filteredData.length; i++) {
      totalExpense += filteredData[i].total;
    }  
    if (totalExpense === 0) {
      setNoDataMessage('No data available');
      setShowBarChart(false);
    } else {
      setNoDataMessage('');
      setShowBarChart(true);
      renderBarChartforPeriod(filteredData);
    }
}, [expensesData, incomeData, selectedMonth, noDataMessage, shouldFilterByYear, shouldFilterByMonth, viewIncome]);

//checks for duplicate income data and adds their amounts
const aggregateIncomeData = (incomeData) => {
  const unduplicatedData = {};
  incomeData.forEach((item) => {
    const { description, amount } = item;
    if (unduplicatedData[description]) {
      unduplicatedData[description] += amount;
    } else {
      unduplicatedData[description] = amount;
    }
  });

  const aggregatedData = Object.keys(unduplicatedData).map((description) => ({
    description,
    amount: unduplicatedData[description],
  }));

  return aggregatedData;
};

const renderBarChartforPeriod = (filteredData) => {
    //deletes previous bars
    d3.select(svgRef.current).selectAll('*').remove();

    //setting the container
    const w = 500;
    const h = 350;
    const svg = d3.select(svgRef.current)
                  .attr('width', w)
                  .attr('height', h)
                  .style('overflow', 'visible')
                  .style('margin-top', '20px')
                  .style('margin-bottom', '20px');

    const xScale = d3.scaleBand()
                  .domain(filteredData.map((val) => viewIncome ? val.description : val.title)) // Use description for income
                  .range([0, w])
                  .padding(0.5);

    const yScale = d3.scaleLinear()
                  .domain([0, d3.max(filteredData, (d) => viewIncome ? d.amount : d.total) || 0]) // Use amount for income
                  .nice()
                  .range([h, 0]);

    const xAxis = d3.axisBottom(xScale)
                  .ticks(filteredData.length);

    const yAxis = d3.axisLeft(yScale)
                  .ticks(5);

    svg.append('g').call(xAxis).attr('transform', `translate(0, ${h})`).classed('axis', true);
    svg.append('g').call(yAxis).classed('axis', true);

    svg.selectAll('.bar')
      .data(filteredData)
      .join('rect')
      .attr('x', (d) => xScale(viewIncome ? d.description : d.title))
      .attr('y', (d) => yScale(viewIncome ? d.amount : d.total))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => h - yScale(viewIncome ? d.amount : d.total))
      .style('fill', (d) => viewIncome ? 'lightblue' : d.color)
      .on('mouseover', function(event, d) {
        
        d3.select(this)
        .style('fill', (d) => viewIncome ? d3.color('lightblue').darker(0.5).toString() : d3.color(d.color).darker(0.5).toString());

        const tooltipValue = viewIncome ? d.amount : d.total;
        const formattedValue = tooltipValue.toLocaleString('en-US', { minimumFractionDigits: 2 });
  
        const tooltipText = svg.append('text')
          .attr('class', 'tooltip-text')
          .text(`$${formattedValue}`);

        const tooltipTextWidth = tooltipText.node().getBBox().width;
        const tooltipWidth = tooltipTextWidth + 20; 

        const tooltipX = xScale(viewIncome ? d.description : d.title) + (xScale.bandwidth() - tooltipWidth) / 2;
        const tooltipY = yScale(viewIncome ? d.amount : d.total) - 25;

        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .style('pointer-events', 'none');

        tooltip.append('rect')
          .attr('x', tooltipX)
          .attr('y', tooltipY)
          .attr('width', tooltipWidth)
          .attr('height', 20)
          .style('fill', 'white')
          .style('stroke', 'black');

        tooltip.append('text')
          .attr('x', tooltipX + tooltipWidth / 2)
          .attr('y', tooltipY + 10)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text(viewIncome ? `$${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `$${d.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

        tooltipText.attr('x', tooltipX + tooltipWidth / 2)
          .attr('y', tooltipY + 10)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle');
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .style('fill', (d) => viewIncome ? 'lightblue' : d.color);
        svg.select('.tooltip').remove();
        svg.selectAll('.tooltip-text').remove();
      });
    };


  //handles the input given by the user in the month selector 
  const handleChangeMonth = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "0") {
      // If the year option is selected, enable yearly filtering
      setSelectedMonth(null);
      setShouldFilterByMonth(false);
      setShouldFilterByYear(true);
    } else {
      // For the months, enable monthly filtering and set the selected month
      const selectedMonth = parseInt(selectedValue);
      setSelectedMonth(selectedMonth);
      setShouldFilterByMonth(true);
      setShouldFilterByYear(false);
    }
  };

  //render the month selector panel
  const renderMonthSelector = () => {
    return (
      <div className='month-selector-panel bar'>
        <select className='select-input' name='months' id='months' onChange={handleChangeMonth} value={selectedMonth}>
          <option value="0">{new Date().getFullYear().toString()}</option>
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

  // Toggle between income and expenses
  const handleToggleView = () => {
    setViewIncome((prev) => !prev);
  };

  return (
    <div>
      <div className='toggle-month'>
        <div className="month-selector-panel">
          {renderMonthSelector()}
        </div>
        <div className="toggle-container">
          <button className="toggle-data" onClick={handleToggleView}>
            {viewIncome ? 'View Expenses' : 'View Income'}
          </button>
        </div>
      </div>
      <div className="bar-chart">
        {noDataMessage !== '' ? (
          <div className="no-data-message">{noDataMessage}</div>
        ) : (
          <svg ref={svgRef}></svg>
        )}
      </div>
    </div>
  );
  
};
export default RenderBarChart;

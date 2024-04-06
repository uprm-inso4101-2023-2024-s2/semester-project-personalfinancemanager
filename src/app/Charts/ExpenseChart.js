import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../globals.css';
import monthlyExpensefilter from '../Page-Functionality/Filters/moneyFilters';
import { yearlyExpenseFilter } from '../Page-Functionality/Filters/moneyFilters';


const RenderPieChart = ({ expensesData }) => {
  const svgRef = useRef();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // State for selected month
  const [showPieChart, setShowPieChart] = useState(false); // State to toggle pie chart visibility
  const [noDataMessage, setNoDataMessage] = useState(''); // State for no data message

  /* This useEffect hook is responsible for updating the pie chart based on changes in expensesData, selectedMonth, 
  or noDataMessage. It begins by filtering expensesData for the selected month and calculating the totalExpense. If totalExpense is zero, indicating no data, 
  it sets the noDataMessage state accordingly and hides the pie chart. Otherwise, it clears any existing no data message, sets showPieChart state to true, 
  and renders the pie chart for the selected month. Dependencies: expensesData, selectedMonth, noDataMessage. */

  useEffect(() => {
    let filteredExpenses;
    if (selectedMonth === 13) { // Check if selected month is the entire year
      filteredExpenses = yearlyExpenseFilter(expensesData, new Date().getFullYear()); // Use yearlyExpenseFilter
      console.log(filteredExpenses);
    } else {
      filteredExpenses = monthlyExpensefilter(expensesData, selectedMonth, new Date().getFullYear());
    }
    let totalExpense = 0;
    for (let i = 0; i < filteredExpenses.length; i++) {
      totalExpense += filteredExpenses[i].total;
    }

    if (totalExpense === 0) {
      setNoDataMessage('No data available');
      setShowPieChart(false);
    } else {
      setNoDataMessage('');
      setShowPieChart(true);
      renderPieChartForMonth(filteredExpenses);
    }

  }, [expensesData, selectedMonth, noDataMessage]);

  const renderPieChartForMonth = (month) => {
    d3.select(svgRef.current).selectAll('*').remove();
    // Filter expenses data for the selected month
    const colorScale = d3.scaleOrdinal().range(month.map(d => d.color));
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    svg.selectAll("text").remove();

    // Appending text elements for total and percentage
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

    // Function to update total and percentage text
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
      .data(pie(month))
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
      
        const totalAmount = d3.sum(month, (d) => d.total);
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
      
        updateTotalText(d3.sum(month, (d) => d.total), '', 0);
      
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }


  //Function to change the select month
  const handleChangeMonth = (event) => {
    const selectedValue = event.target.value;
    setSelectedMonth(parseInt(selectedValue));
  };

  {/* This section represents the container for the pie chart component. 
  It includes a dropdown menu to select the month using a select-input2 class for styling, 
  with options ranging from January to December. Depending on whether there is a noDataMessage 
  present, it conditionally renders either a div displaying the message using a no-data-message class 
  or the SVG element for the pie chart rendered via D3, which is referenced using the svgRef. */}  

  return (
    
    <div className="pie-chart">
      <select className="select-input2" value={selectedMonth} onChange={handleChangeMonth}>
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
        <option value="13">All 2024</option> {/* New option for the entire year */}
      </select>
      {noDataMessage != '' ? (
      <div className="no-data-message">{noDataMessage}</div>
      ) : (
        <svg ref={svgRef}></svg>
      )}    
    </div>
  );
};

export default RenderPieChart;
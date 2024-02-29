import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Calendar = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        renderCalendar();
    }, []);

    const renderCalendar = () => {
        const svg = d3.select(svgRef.current);
    
        // Set the dimensions and margins of the SVG
        const margin = { top: 50, right: 20, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
    
        // Append the SVG element to the div
        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
        // Get the current date
        const currentDate = new Date();
    
        // Extract the year and month from the current date
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
    
        // Set the range of days for the current month
        const daysInCurrentMonth = d3.timeDays(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1));
    
        // Set cell size
        const cellSize = 30;
    
        // Create scales
        const xScale = d3.scaleBand().range([0, width]).domain(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
        const yScale = d3.scaleBand().range([0, height]).domain(d3.range(0, 7)); // Maximum of 6 weeks in a month
    
        // Create cells for each day
        svg.selectAll('.day')
            .data(daysInCurrentMonth)
            .enter().append('rect')
            .attr('class', 'day')
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('x', d => xScale(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]))
            .attr('y', d => yScale(d3.timeWeek.count(d3.timeMonth(d), d))) // Calculate the week of the month properly
            .attr('fill', d => d.getDate() === currentDate.getDate() ? 'orange' : 'white') // Highlight current day
            .attr('stroke', 'blue');
    
        // Add day labels
        svg.selectAll('.day-label')
            .data(daysInCurrentMonth)
            .enter().append('text')
            .attr('class', 'day-label')
            .attr('x', d => xScale(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth() / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.getDate());
    
        // Add month and year label
        svg.append('text')
            .attr('class', 'month-year-label')
            .attr('x', width / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .text(`${currentMonth + 1}/${currentYear}`); // Display month and year
    
        // Add a rectangle below the text to display the month name
        svg.append('rect')
            .attr('x', 0)
            .attr('y', height - 130) // Adjust position accordingly
            .attr('width', width)
            .attr('height', 30) // Adjust height accordingly
            .attr('fill', 'white')
            .attr('stroke', 'blue');
    
        // Add text for the month name
        svg.append('text')
            .attr('class', 'month-name-label')
            .attr('x', width / 2)
            .attr('y', height - 110) // Adjust position accordingly
            .attr('text-anchor', 'middle')
            .text(d3.timeFormat('%B')(new Date(currentYear, currentMonth))); // Display month name
    
        // Add a rectangle below the text to display the year
        svg.append('rect')
            .attr('x', 0)
            .attr('y', height - 100) // Adjust position accordingly
            .attr('width', width)
            .attr('height', 30) // Adjust height accordingly
            .attr('fill', 'white')
            .attr('stroke', 'blue');
    
        // Add text for the year
        svg.append('text')
            .attr('class', 'year-label')
            .attr('x', width / 2)
            .attr('y', height - 80) // Adjust position accordingly
            .attr('text-anchor', 'middle')
            .text(currentYear); // Display year
    };
    
    
    
    return (
        <div id="calendar-container">
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Calendar;

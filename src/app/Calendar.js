import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * Represents a calendar component rendered using D3.js.
 */
const Calendar = () => {
    const svgRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [showMonthSelectorPanel, setShowMonthSelectorPanel] = useState(false);

    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000); // Update every second
        return function cleanup() {
            clearInterval(timerID);
        };
    }, []); // Run only once when component mounts

    /**
     * Updates the current time state.
     */
    const tick = () => {
        setCurrentTime(new Date()); // Update current time
    };

    useEffect(() => {
        renderCalendar();
    }, [currentTime, currentMonth]); // Re-render whenever currentTime changes

    /**
     * Renders the calendar using D3.js.
     */
    const renderCalendar = () => {
        const svg = d3.select(svgRef.current);
    
        // Clear the SVG content before re-rendering
        svg.selectAll('*').remove();
    
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
        const currentYear = currentTime.getFullYear();
    
        // Set the range of days for the current month
        const daysInCurrentMonth = d3.timeDays(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1));
    
        // Set cell size
        const cellSize = 30;
    
        // Create scales
        const xScale = d3.scaleBand().range([0, width]).domain(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
        const yScale = d3.scaleBand().range([0, height]).domain(d3.range(0, 7)); // Maximum of 6 weeks in a month
    
        // Add day labels in the top row
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        svg.selectAll('.day-label-top')
            .data(dayLabels)
            .enter().append('text')
            .attr('class', 'day-label-top')
            .attr('x', (d, i) => xScale(d) + xScale.bandwidth() / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '20')
            .text(d => d);
    
        // Create cells for each day
        svg.selectAll('.day')
            .data(daysInCurrentMonth)
            .enter().append('rect')
            .attr('class', 'day')
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('x', d => xScale(dayLabels[d.getDay()]))
            .attr('y', d => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth())
            .attr('fill', d => {
                if ((d.getDate() < currentTime.getDate() && d.getMonth() === currentTime.getMonth()) || (d.getMonth() < currentTime.getMonth())) {
                    return '#d3d3d3'; // Day has passed
                } else if (d.getDate() === currentTime.getDate() && d.getMonth() === currentTime.getMonth()) {
                    return 'lime'; // Highlight current day
                } else {
                    return 'white'; // Future days
                }
            })
            .attr('stroke', 'black');
    
        // Add day labels
        svg.selectAll('.day-label')
            .data(daysInCurrentMonth)
            .enter().append('text')
            .attr('class', 'day-label')
            .attr('x', d => xScale(dayLabels[d.getDay()]) + xScale.bandwidth() / 6)
            .attr('y', d => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth()*1.2)
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
    
        // Add text for the month name
        svg.append('text')
            .attr('class', 'month-name-label')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('text-anchor', 'middle')
            .text(d3.timeFormat('%B')(new Date(currentYear, currentMonth))); // Display month name
    
        // Add text for the year
        svg.append('text')
            .attr('class', 'year-label')
            .attr('x', width / 1.05)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('text-anchor', 'middle')
            .text(currentYear); // Display year
    
        // Add current time display
        svg.append('text')
            .attr('class', 'current-time-label')
            .attr('x', 10)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('fill', 'black')
            .text(d3.timeFormat('%H:%M:%S')(currentTime)); // Display current time
    };

    const changeMonth = (month) => {
        setCurrentMonth(month);
    };

    const toggleMonthPanel = () => {
        setShowMonthSelectorPanel(!showMonthSelectorPanel); // Toggle the state
    };

    return (
        <div>
            <div>
                <button className="btn btn-primary" onClick={toggleMonthPanel}>MONTHS</button> {/* Button to toggle month panel visibility */}
                {showMonthSelectorPanel && (
                    <div className="month-panel">
                        <div className="year-label">{currentTime.getFullYear()}</div>
                        <div className="month-grid">
                            <div className="top-row">
                                {Array.from({ length: 6 }, (_, i) => {
                                    const monthIndex = i;
                                    const monthName = d3.timeFormat('%B')(new Date(currentTime.getFullYear(), monthIndex));
                                    const isCurrentMonth = currentMonth === monthIndex;
                                    return (
                                        <button
                                            key={monthIndex}
                                            className={`month-tile ${isCurrentMonth ? 'current-month' : ''}`}
                                            onClick={() => changeMonth(monthIndex)}
                                        >
                                            {monthName}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="bottom-row">
                                {Array.from({ length: 6 }, (_, i) => {
                                    const monthIndex = i + 6;
                                    const monthName = d3.timeFormat('%B')(new Date(currentTime.getFullYear(), monthIndex));
                                    const isCurrentMonth = currentMonth === monthIndex;
                                    return (
                                        <button
                                            key={monthIndex}
                                            className={`month-tile ${isCurrentMonth ? 'current-month' : ''}`}
                                            onClick={() => changeMonth(monthIndex)}
                                        >
                                            {monthName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div id="calendar-container">
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default Calendar;

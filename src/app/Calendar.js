import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Calendar.css'

/**
 * Represents a calendar component rendered using D3.js.
 */
const Calendar = () => {
    const svgRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [inputMode, setInputMode] = useState(false);
    const [dayInput, setDayInput] = useState({});
    const [submittedData, setSubmittedData] = useState({});
    const [expectedExpenses, setExpectedExpenses] = useState({});
    const [daysWithData, setDaysWithData] = useState([]);



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
    }, [currentTime, submittedData]); // Re-render whenever currentTime changes

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
        const currentMonth = currentTime.getMonth();
    
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
            .attr('class', (d) => {
                const hasData = daysWithData.some(date => date.toDateString() === d.toDateString());
                const hasSubmittedData = submittedData[d] !== undefined;
                return `day${hasData ? ' with-data' : ''}${hasSubmittedData ? ' submitted' : ''}`;
            })
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('x', (d) => xScale(dayLabels[d.getDay()]))
            .attr('y', (d) => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth())
            .attr('fill', (d) => {
                if (d.getDate() < currentTime.getDate()) {
                    return '#d3d3d3'; 
                } else if (d.getDate() === currentTime.getDate()) {
                    return 'lime';  
                } else {
                    return 'white'; 
                }
            })
            .attr('stroke', (d) => {
                if (d.getDate() === currentTime.getDate()) {
                    return 'lime'; 
                } else {
                    return 'black'; 
                }
            })
            .on('click', (event, d) => handleClick(event, d))
            .style('cursor', 'pointer');


    
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
            .text(`${currentMonth + 1}/${currentYear}`); 
    
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

        if(selectedDay !== null) {
            renderPanel(selectedDay);
        }
    };
    
    const handleClick = (event, day) => {
        setSelectedDay(day);
    
        const hasInput = dayInput[day] || submittedData[day];
    
        setInputMode(!hasInput);
    
        if (hasInput) {
            setDayInput({ ...dayInput, [day]: '' });
        }
    
        setDaysWithData((prevDaysWithData) => {
            if (hasInput && !prevDaysWithData.some(date => date.toDateString() === day.toDateString())) {
                return [...prevDaysWithData, day];
            } else if (!hasInput && prevDaysWithData.some(date => date.toDateString() === day.toDateString())) {
                return prevDaysWithData.filter((d) => d.toDateString() !== day.toDateString());
            }
            return prevDaysWithData;
        });
    };    
    

    const handleInputChange = (event) => {
        setDayInput({ ...dayInput, [selectedDay]: event.target.value });
    };

    const handleExpensesChange = (event) => {
        setExpectedExpenses({ ...expectedExpenses, [selectedDay]: event.target.value });
    };

    const handleSubmit = () => {
        setSubmittedData({
            ...submittedData,
            [selectedDay]: {
                event: dayInput[selectedDay] || '',
                expenses: expectedExpenses[selectedDay] || ''
            }
        });
        setDayInput({ ...dayInput, [selectedDay]: '' });
        setExpectedExpenses({ ...expectedExpenses, [selectedDay]: '' });
    };

    const renderPanel = () => {
        const submittedInfo = submittedData[selectedDay];

        const shouldRenderForm = selectedDay !== null && !inputMode;

        return (
            <div className="panel">
                {shouldRenderForm && (
                    <>
                        <label className="input-ground"> Event of the day: </label>
                        <div className={`input-ground${submittedInfo && submittedInfo.expenses ? ' with-border' : ''}`}>
                            <div>
                                <strong>Event:</strong> {submittedInfo && submittedInfo.event}
                            </div>
                            {submittedInfo && submittedInfo.expenses && (
                                <div>
                                    <strong>Expected Expenses:</strong> {submittedInfo.expenses}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {inputMode && selectedDay !== null && (
                    <>
                        <label className="input-ground"> Event of the day: </label>
                        <textarea
                            className="input-ground textarea"
                            value={dayInput[selectedDay] || ''}
                            onChange={handleInputChange}
                            placeholder="Write something..."
                        />
                        <button onClick={handleSubmit} className="submit-button">
                            Submit
                        </button>

                        <label className="input-ground"> Expected Expenses: </label>
                        <input
                            type="text"
                            className="input-ground"
                            value={expectedExpenses[selectedDay] || ''}
                            onChange={handleExpensesChange}
                            placeholder="Enter expected expenses..."
                        />
                    </>
                )}
            </div>
        );
    };

    return (
        <div id="calendar-container">
            {renderPanel()}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Calendar;
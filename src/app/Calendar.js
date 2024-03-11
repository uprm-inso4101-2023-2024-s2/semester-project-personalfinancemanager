import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Calendar.css';

const Calendar = () => {
    const svgRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
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

    const tick = () => {
        setCurrentTime(new Date()); // Update current time
    };

    useEffect(() => {
        renderCalendar();
    }, [currentTime, submittedData]); // Re-render whenever currentTime changes

    const renderCalendar = () => {
        const svg = d3.select(svgRef.current);

        svg.selectAll('*').remove();

        const margin = { top: 50, right: 20, bottom: 50, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        svg.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const currentYear = currentTime.getFullYear();
        const currentMonth = currentTime.getMonth();

        const daysInCurrentMonth = d3.timeDays(new Date(currentYear, currentMonth, 1), new Date(currentYear, currentMonth + 1, 1));

        const cellSize = 30;

        const xScale = d3.scaleBand().range([0, width]).domain(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
        const yScale = d3.scaleBand().range([0, height]).domain(d3.range(0, 7));

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

        svg.selectAll('.day')
            .data(daysInCurrentMonth)
            .enter().append('rect')
            .attr('class', (d) => {
                const hasData = daysWithData.some(date => date.toDateString() === d.toDateString());
                const hasSubmittedData = submittedData[d] !== undefined;
                const isToday = d.getDate() === currentTime.getDate();
                const hasEvents = submittedData[d] && submittedData[d].events && submittedData[d].events.length > 0;
                return `day${hasData ? ' with-data' : ''}${hasSubmittedData ? ' submitted' : ''}${isToday && hasEvents ? ' orange-fill' : ''}`;
            })
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('x', (d) => xScale(dayLabels[d.getDay()]))
            .attr('y', (d) => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth())
            .attr('fill', (d) => {
                const isToday = d.getDate() === currentTime.getDate();
                const hasEvents = submittedData[d] && submittedData[d].events && submittedData[d].events.length > 0;

                if (d.getDate() < currentTime.getDate()) {
                    return '#d3d3d3';
                } else if (isToday && hasEvents) {
                    return 'orange';
                } else if (isToday) {
                    return 'lime';
                } else {
                    return 'white';
                }
            })
            .attr('stroke', (d) => 'black')
            .on('click', (event, d) => handleClick(event, d))
            .style('cursor', 'pointer');

        svg.selectAll('.day-label')
            .data(daysInCurrentMonth)
            .enter().append('text')
            .attr('class', 'day-label')
            .attr('x', d => xScale(dayLabels[d.getDay()]) + xScale.bandwidth() / 6)
            .attr('y', d => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth() * 1.2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.getDate());

        const monthYearLabel = `${currentMonth + 1}/${currentYear}`;
        svg.append('text')
            .attr('class', 'month-year-label')
            .attr('x', width / 2)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .text(monthYearLabel);

        const monthNameLabel = d3.timeFormat('%B')(new Date(currentYear, currentMonth));
        svg.append('text')
            .attr('class', 'month-name-label')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('text-anchor', 'middle')
            .text(monthNameLabel);

        const yearLabel = currentYear;
        svg.append('text')
            .attr('class', 'year-label')
            .attr('x', width / 1.05)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('text-anchor', 'middle')
            .text(yearLabel);

        const currentTimeLabel = d3.timeFormat('%H:%M:%S')(currentTime);
        svg.append('text')
            .attr('class', 'current-time-label')
            .attr('x', 10)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('fill', 'black')
            .text(currentTimeLabel);

        if (selectedDay !== null) {
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
        if ((dayInput[selectedDay] ?? '').trim() !== '') {
            setSubmittedData({
                ...submittedData,
                [selectedDay]: {
                    events: [
                        ...(submittedData[selectedDay]?.events || []),
                        {
                            event: dayInput[selectedDay] || '',
                            expenses: expectedExpenses[selectedDay] || ''
                        }
                    ],
                }
            });
            setDayInput({ ...dayInput, [selectedDay]: '' });
            setExpectedExpenses({ ...expectedExpenses, [selectedDay]: '' });
        }
    };

    const renderPanel = () => {
        const submittedInfo = submittedData[selectedDay];
    
        const shouldRenderForm = selectedDay !== null && !inputMode;
    
        return (
            <div className="panel">
                {shouldRenderForm && (
                    <>
                        <label className="input-ground"> Events of the day: </label>
                        {submittedInfo && submittedInfo.events && (
                            <div className="events-list">
                                <strong>Events:</strong>
                                <ul>
                                    {submittedInfo.events.map((event, index) => (
                                        <li key={index}>
                                            <strong>Event:</strong> {event.event} &nbsp;
                                            {event.expenses && (
                                                <>
                                                    <strong>Expenses:</strong> {event.expenses}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button onClick={() => setInputMode(true)} className="add-event-button">
                            Add Event
                        </button>
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
                        <label className="input-ground"> Expected Expenses: </label>
                        <input
                            type="text"
                            className="input-ground"
                            value={expectedExpenses[selectedDay] || ''}
                            onChange={handleExpensesChange}
                            placeholder="Enter expected expenses..."
                        />
                        <button onClick={handleSubmit} className="submit-button">
                            Submit
                        </button>
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

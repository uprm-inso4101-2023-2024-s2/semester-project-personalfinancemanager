import React, { useEffect, useRef, useState, useContext, createContext } from 'react';
import Modal from "@/app/Modals/modal";
import monthlyExpensefilter , { monthlyIncomeFilter } from './Filters/moneyFilters';
import { financeContext } from '../Finance-Context/finance-context';
import { toast } from 'react-toastify';
import * as d3 from 'd3';
import './Calendar.css';

const Calendar = () => {
    const svgRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const {expenses, income, monthlyBudgets, events, createMonthlyBudgets, updateMonthlyBudgets, addEvent, deleteEvent,} = useContext(financeContext);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    /* 
    State variables used to manage the interactive behavior of the calendar component.

    - selectedDay: Represents the currently selected day in the calendar. Initialized to null.
    - inputMode: Tracks whether the calendar is in input mode, allowing the user to add events. Initialized to false.
    - dayInput: Holds input data for each day, where the date is the key. Initialized as an empty object.
    - submittedData: Keeps track of submitted events for each day, with the date as the key. Initialized as an empty object.
    - expectedExpenses: Stores the expected expenses for each day with the date as the key. Initialized as an empty object.
    - daysWithData: Keeps a list of days that have associated data. Initialized as an empty array.
    - removedEvents: Tracks the days from which events have been removed, with the date as the key. Initialized as an empty object.
    */
    const [selectedDay, setSelectedDay] = useState(null);
    const [inputMode, setInputMode] = useState(false);
    const [dayInput, setDayInput] = useState('');
    const [submittedData, setSubmittedData] = useState([]);
    const [expectedExpenses, setExpectedExpenses] = useState(0);
    const [daysWithData, setDaysWithData] = useState([]);
    const [removedEvents, setRemovedEvents] = useState({});
    // State to control the visibility of the modal
    const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
    // State to hold the budget input
    const [budgetInput, setBudgetInput] = useState('');
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
    
    //Variables to calculate total income, total expenses, and the percentage of the total expenses compared to the monthly budget.
    useEffect(() => {
        const monthlyincome = monthlyIncomeFilter(income, currentMonth + 1, currentTime.getFullYear());
        const monthlyexpenses = monthlyExpensefilter(expenses, currentMonth + 1, currentTime.getFullYear());
        const totalExpenses = monthlyexpenses.reduce((total, category) => {
        const categoryTotal = category.items.reduce((itemTotal, item) => {
            return itemTotal + item.amount;
        }, 0);
        return total + categoryTotal;
        }, 0);
        const totalIncome = monthlyincome.reduce((total, item) => total + item.amount, 0);
        let monthlyBudgetAmount = 1;
        if(monthlyBudgets && monthlyBudgets.budgets && monthlyBudgets.budgets.length > 0) {
            if(monthlyBudgets.budgets[currentMonth] !== 0) monthlyBudgetAmount = monthlyBudgets.budgets[currentMonth];
        }
        let progressValue = (totalExpenses / monthlyBudgetAmount) * 100;
        progressValue > 100 ? progressValue = 100 : progressValue = progressValue;
        setProgress(progressValue);
    },[currentTime, submittedData, currentMonth, monthlyBudgets, income, expenses]);

    useEffect(() => {
        const formattedSubmittedData = events.reduce((acc, event) => {
            const eventDate = event.date.toDateString();
            acc[eventDate] = acc[eventDate] || { events: [] };
            acc[eventDate].events.push(event);
            return acc;
        }, {});
        setSubmittedData(formattedSubmittedData);
    }, [events]);

    const renderBudgetButton = () => {
        return (
        <div className='budget-button'>
            <button onClick={handleAddOrUpdateBudget}>Add/Update Monthly Budget</button>
        </div>
        );
    }

    function renderProgressBar(percentage){
        return (
            <div className="progressBar">
            <div className="progress"style={{ width: `${percentage}%` }}> </div>
        </div>
    );
    }

    /** Handles the budget button. Adds a budget to the database if the user does not already have one. 
     * If the user has a budget, then it is updated.
     * 
     */

    // Modified handleAddOrUpdateBudget function
    const handleAddOrUpdateBudget = () => {
        setIsBudgetModalVisible(true); // Show the modal instead of using window.prompt
    };

    const handleBudgetSubmit = () => {
        const budget = parseFloat(budgetInput);
        if (!isNaN(budget)) {
            if (!monthlyBudgets.budgets || monthlyBudgets.budgets.length === 0) {
                createMonthlyBudgets(budget, currentMonth);
                toast.success('Budget added successfully.');
            } else {
                updateMonthlyBudgets(budget, currentMonth);
                toast.success('Budget updated successfully.');
            }
            setIsBudgetModalVisible(false);
            setBudgetInput('');
        } else {
            toast.error("Please enter a valid number.");
        }
    };


    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000); // Update every second
        return function cleanup() {
            clearInterval(timerID);
        };
    }, []); // Run only once when the component mounts

    const tick = () => {
        setCurrentTime(new Date()); // Update current time
    };

    useEffect(() => {
        renderCalendar();
    }, [currentTime, submittedData, currentMonth]); // Re-render whenever currentTime or submittedData changes

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
                const isToday = d.getDate() === currentTime.getDate() && d.getMonth() === currentTime.getMonth();
                const hasEvents = submittedData[d] && submittedData[d].events && submittedData[d].events.length > 0;

                // Check if the day has been removed
                const hasRemovedEvents = removedEvents[d];

                 /*
                Generates a string representing a combination of CSS classes for a calendar day based on conditions.
                - "day": Base CSS class always present.
                - "with-data": Added if there is data for the day.
                - "submitted": Added if events have been submitted for the day.
                - "orange-fill": Added if today and events have been submitted.
                - "removed": Added if events for the day have been removed.
                */
                return `day${hasData ? ' with-data' : ''}${hasEvents ? ' submitted' : ''}${isToday && hasEvents  ? ' orange-fill' : ''}${hasRemovedEvents ? ' removed' : ''}`;
            })
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('x', (d) => xScale(dayLabels[d.getDay()]))
            .attr('y', (d) => yScale(d3.timeWeek.count(d3.timeMonth(d), d)) + yScale.bandwidth())
            .attr('fill', (d) => {
                const hasEvents = events.some(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === d.getDate() && eventDate.getMonth() === d.getMonth() && eventDate.getFullYear() === d.getFullYear();
                });
                
                const isToday = d.getDate() === currentTime.getDate() && d.getMonth() === currentTime.getMonth();
                if ((d.getDate() < currentTime.getDate() && d.getMonth() === currentTime.getMonth()) || (d.getMonth() < currentTime.getMonth())) {
                    return '#d3d3d3'; // Day has passed
                } else if (hasEvents) {
                    return 'orange'; // Day has events
                } else if (isToday) {
                    return 'lime'; // Highlight current day
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
            .text(`${currentMonth + 1}/${currentYear}`); 
    
        // Add text for the year
        svg.append('text')
            .attr('class', 'year-label')
            .attr('x', width / 1.05)
            .attr('y', 20)
            .attr('font-size', '25')
            .attr('text-anchor', 'middle')
            .text(monthYearLabel);

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

    /* 
    Function to handle clicks on a calendar day.
    - Updates the selected day.
    - Manages input mode, enabling it if there's no input or submitted events.
    - Resets input for the selected day if already present.
    - Resets removed events when switching to input mode or when no events are left.
    - Updates the list of days with data based on input presence and day existence.
    */
    const handleClick = (event, day) => {
        setSelectedDay(day);

        const hasInput = events.some(event => event.date.toDateString() === day.toDateString());

        // Reset input mode when switching between days
        setInputMode(false);

        if (!hasInput) {
            setInputMode(true);
        }

        if (hasInput) {
            const eventData = events.find(event => event.date.toDateString() === day.toDateString());
            setDayInput(eventData);
        }

    };

        /* 
    Updates the input for the selected day.
    - Uses event target value to update day input state.
    */
    const handleInputChange = (event) => {
        setDayInput({ ...dayInput, [selectedDay]: event.target.value });
    };

    /* 
    Updates the expected expenses for the selected day.
    - Uses event target value to update expected expenses state.
    */
    const handleExpensesChange = (event) => {
        setExpectedExpenses({ ...expectedExpenses, [selectedDay]: event.target.value });
    };

    /* 
    Removes the last submitted event for the selected day.
    - Checks if there is a selected day with submitted data.
    - Removes the last event and updates removed events and the SVG element fill color.
    */
    const handleRemoveEvent = () => {
        if (selectedDay && submittedData[selectedDay]) {
            const updatedSubmittedData = { ...submittedData };

            // Replace with the actual width and height of your SVG container
            const width = 800;
            const height = 600;

            const yScale = d3.scaleBand().range([0, height]).domain(d3.range(0, 7));
            const xScale = d3.scaleBand().range([0, width]).domain(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

            const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // Remove the last event
            const updatedEvents = updatedSubmittedData[selectedDay].events.slice(0, -1);
            updatedSubmittedData[selectedDay].events = updatedEvents;

            // Set removed events for the selected day
            setRemovedEvents({ ...removedEvents, [selectedDay]: true });

            // Update the fill color directly in the SVG element
            const svg = d3.select(svgRef.current);
            const removedDay = svg.select(`.day[fill='white'][y='${yScale(d3.timeWeek.count(d3.timeMonth(selectedDay), selectedDay)) + yScale.bandwidth()}'][x='${xScale(dayLabels[selectedDay.getDay()])}']`);

            if (removedDay) {
                removedDay.attr('fill', 'white');
            }

            setSubmittedData(updatedSubmittedData);
        }
    };

    /* 
    Submits the input data for the selected day.
    - Checks if the input is not empty before updating the submitted data state.
    - Updates events and expected expenses for the selected day.
    - Resets input values for the selected day.
    */
    const handleSubmit = async () => {
        if ((dayInput[selectedDay] ?? '').trim() !== '') {
            // Prepare the data to be submitted
            const newEvent = {
              event: dayInput[selectedDay],
              expenses: +expectedExpenses[selectedDay] 
            };
        
            const updatedSubmittedData = {
              ...submittedData,
              [selectedDay]: {
                events: [
                  ...(submittedData[selectedDay]?.events || []),
                  newEvent
                ]
              }
            };
        
            // Set the submitted data locally
            setSubmittedData(updatedSubmittedData);
            
            // Call the submitEventData function with the data
            await addEvent( {
                date: selectedDay,
                event: newEvent,
              });
              
            setDayInput('');
            // Clear input values if necessary
            setExpectedExpenses(0);
        }
    };
        
    // Renders the panel based on the selected day and input mode.
    const renderPanel = () => {
        const submittedInfo = submittedData[selectedDay];

        // Check if the form should be rendered (selected day is not null and not in input mode)
        const shouldRenderForm = selectedDay !== null && !inputMode;

        let hasInputEvents = false;
        let eventsForSelectedDay = [];

        debugger;
        if (selectedDay) {
            hasInputEvents = events.some(event => event.date.toDateString() === selectedDay.toDateString());
            eventsForSelectedDay = events.filter(event => event.date.toDateString() === selectedDay.toDateString());
        }
        return (
            <>
                {shouldRenderForm &&(
                    <div>
                        <button onClick={() => setSelectedDay(null)} className="close-button">
                            X
                        </button>
                        <label className="input-ground"> Events of {selectedDay.toLocaleDateString()}: </label>

                        {/* Container for events with optional border based on submitted expenses */}
                        <div className={`input-ground${hasInputEvents ? ' with-border' : ''}`}>
                            {/* Render submitted events if available, otherwise display a message */}
                            {hasInputEvents ? (
                                eventsForSelectedDay.map((event, index) => (
                                    <div key={index}>
                                        <strong>Event {index + 1}:</strong> {event.eventInfo.event}
                                        {event.eventInfo.expense && (
                                            <span className="expected-expenses"> - Expected Expenses: {event.eventInfo.expense}</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>No events for this day</div>
                            )}

                            {/* Display total expenses if available */}
                            {submittedInfo && submittedInfo.expenses && (
                                <div>
                                    <strong>Total Expenses:</strong> {submittedInfo.expenses}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {inputMode && selectedDay !== null && (
                    <>
                        <button onClick={() => setSelectedDay(null)} className="close-button" >
                            X
                        </button>
                        <label className="input-ground"> Events for {selectedDay.toLocaleDateString()}: </label>
                        <textarea
                            className="input-ground textarea"
                            value={dayInput[selectedDay] || ''}
                            onChange={handleInputChange}
                            placeholder="Write something... (max 5 words)"
                            maxLength="60"
                        />
                        <input
                            type="number"
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

                {!inputMode && selectedDay !== null && (
                    <div className="event-display">
                        {/* Buttons for adding an event, removing the last event, and closing the panel */}
                        <button onClick={() => setInputMode(true)} className="submit-button">
                            Add Event
                        </button>
                        <button onClick={handleRemoveEvent} className="remove-event-button">
                                Remove Last Event
                        </button>
                    </div>
                )}
            </>
        );
    };

    const handleChangeMonth = (event) => {
        const selectedMonth = parseInt(event.target.value);
        console.log('Selected month:', selectedMonth);
        setCurrentMonth(selectedMonth);
    };


    const renderMonthSelector = () => {
        return (
            <div className='month-selector-panel'>
                <select className='select-input' name='months' id='months' onChange={handleChangeMonth} value={currentMonth}>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>
            </div>
        );
    };


    return (
        <div>
            {renderBudgetButton()}
            <div className='month-selector-panel'>
                {renderMonthSelector()}
            </div>
            <div id="calendar-container">
                {renderProgressBar(progress)}
                <div className='panel'>
                    {renderPanel()}
                </div>
                <svg id='calendarSvg' ref={svgRef}></svg>
            </div>
            <div>
                <Modal show={isBudgetModalVisible} onClose={() => setIsBudgetModalVisible(false)} >
                    <div className="modal-content">
                        <h2>Monthly Budget for {months[currentMonth]}</h2> {/* Display the current month */}
                        <input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="Enter monthly budget"
                        />
                        <button className="modal-button" onClick={handleBudgetSubmit}>Submit</button>
                        {monthlyBudgets && monthlyBudgets.budgets && monthlyBudgets.budgets.length > currentMonth ?
                            <div className="modal-current-budget">
                                Current Budget: {monthlyBudgets.budgets[currentMonth] ? monthlyBudgets.budgets[currentMonth] : "No budget set"}
                            </div>
                            : <div className="modal-current-budget">No budget set for this month.</div>
                        }
                        <div className="financial-tips">
                            <h3>Did you know?</h3>
                            <p>If you spend money... YOU LOSE MONEY!</p>
                            <img src="https://th.bing.com/th/id/OIP.DbA7_sgVYhfgqUIrYopxXwHaHR?rs=1&pid=ImgDetMain" alt="Nice Picture" style={{ width: '30%', height: 30 }} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};


export default Calendar;

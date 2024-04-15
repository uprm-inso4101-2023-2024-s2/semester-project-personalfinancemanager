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
    const monthBackgroundImages = [
        'url("https://th.bing.com/th/id/R.06e047eb19cf7edb0d16dee7ba395414?rik=MStN4Jy4%2bR7ynQ&pid=ImgRaw&r=0")',
        'url("https://wallpapercave.com/wp/wp3428022.jpg")',
        'url("https://wallpaperaccess.com/full/3458155.jpg")',
        'url("https://cdn.wallpapersafari.com/54/56/2LpXc8.jpg")',
        'url("https://www.wallpaperbetter.com/wallpaper/164/829/177/thumbnails-2K-wallpaper-middle-size.jpg")',
        'url("https://th.bing.com/th/id/OIP.fIny0J3xS_WcfhTze9LSAgAAAA?rs=1&pid=ImgDetMain")',
        'url("https://th.bing.com/th?id=OIF.Rj10%2b2vuliq24dzZFlXHmA&rs=1&pid=ImgDetMain")',
        'url("https://th.bing.com/th/id/OIP.joBxCxydZ04kA_k4JcoG1wHaD0?pid=ImgDet&w=199&h=102&c=7&dpr=1,8")',
        'url("https://www.inside-the-outside.com/wp-content/uploads/2016/08/FrielChris-Memorial-14.jpg")',
        'url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/28304a19980795.562f32ba783e3.jpg")',
        'url("https://wallpapercave.com/wp/ibG1tbs.jpg")',
        'url("https://wallpaperaccess.com/full/2407092.jpg")',
      ];
    /* 
    State variables used to manage the interactive behavior of the calendar component.

    - selectedDay: Represents the currently selected day in the calendar. Initialized to null.
    - inputMode: Tracks whether the calendar is in input mode, allowing the user to add events. Initialized to false.
    - dayInput: Holds input data for each day, where the date is the key. Initialized as an empty object.
    - expectedExpenses: Stores the expected expenses for each day with the date as the key. Initialized as an empty object.
    - daysWithData: Keeps a list of days that have associated data. Initialized as an empty array.
    - removedEvents: Tracks the days from which events have been removed, with the date as the key. Initialized as an empty object.
    */
    const [selectedDay, setSelectedDay] = useState(null);
    const [inputMode, setInputMode] = useState(false);
    const [dayInput, setDayInput] = useState('');
    const [expectedExpenses, setExpectedExpenses] = useState(0);
    // State to control the visibility of the modal
    const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
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
    },[currentTime, currentMonth, monthlyBudgets, income, expenses]);


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

    const calculateTotalExpenses = (eventsForSelectedDay) => {
        const totalExpenses = eventsForSelectedDay.reduce((total, event) => {
            return total + (event.eventInfo.expense || 0); // Use 0 if expense is undefined
        }, 0);
        return totalExpenses;
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
        if (!isNaN(budget) && budget >= 0) {
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
    const confirmSubmit = () => {
        setShowConfirmationModal(false);
        handleBudgetSubmit();
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
    }, [currentTime, currentMonth]); 

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
                    return 'rgba(211, 211, 211, 0.8)'; // Day has passed
                } else if(hasEvents) {
                        return 'rgba(255, 165, 0, 0.8)'; // Highlight current day with event
                    } else if (isToday && (d.getMonth() === currentTime.getMonth())) {
                        return 'rgba(50, 205, 50, 0.8)'; // Highlight current day
                    } else {
                    return 'rgba(255, 255, 255, 0.8)';
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
    const handleRemoveEvent = async () => {
        if (selectedDay) {
            const eventsForSelectedDay = events.filter(event => event.date.toDateString() === selectedDay.toDateString());
            if (eventsForSelectedDay.length > 0) {
                const eventID = eventsForSelectedDay[eventsForSelectedDay.length - 1].id;
                await deleteEvent(eventID);
                toast.success("Last event deleted succesfully.");
            } else {
                toast.error("There is no event to delete.");
            }
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
            if(isNaN(+expectedExpenses[selectedDay]) || +expectedExpenses[selectedDay] <= 0){
                toast.error("Please enter a number before submitting.");
                return;
            }
            
            const newEvent = {
              event: dayInput[selectedDay],
              expense: +expectedExpenses[selectedDay] 
            };

            await addEvent( {
                date: selectedDay,
                eventInfo: newEvent,
              });
              
            setDayInput('');
            setExpectedExpenses(0);
            toast.success("Event added successfully!");
            setTimeout(() => {
                toast.warning("You can keep adding events, close and reopen the panel to view your events.")
            }, 2000);
            } else {
            toast.error("Please enter something before submitting.");
        }
    };
        
    // Renders the panel based on the selected day and input mode.
    const renderPanel = () => {

        // Check if the form should be rendered (selected day is not null and not in input mode)
        const shouldRenderForm = selectedDay !== null && !inputMode;

        let hasInputEvents = false;
        let eventsForSelectedDay = [];

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
                            <div>
                                <strong>Total Expenses:</strong> {calculateTotalExpenses(eventsForSelectedDay)}
                            </div>
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
            <div id="calendar-container" style={{ backgroundImage: monthBackgroundImages[currentMonth] }}>
                {renderBudgetButton()}
                <div className='month-selector-panel'>
                    {renderMonthSelector()}
                </div>
                {renderProgressBar(progress)}
                <div className='panel'>
                    {renderPanel()}
                </div>
                <svg id='calendarSvg' ref={svgRef}></svg>
            </div>
            <div>
                <Modal show={isBudgetModalVisible} onClose={() => setIsBudgetModalVisible(false)} >
                    <div className="modal-content">
                        <h1>Monthly Budget for {months[currentMonth]}</h1> {/* Display the current month */}
                        <input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            placeholder="Enter monthly budget"
                        />
                        <button className="modal-button"     onClick={() => {
                            if (budgetInput >= 0 && budgetInput !== '') {
                                setShowConfirmationModal(true);
                            } else {
                                confirmSubmit(); // Or handle the empty input case as needed
                            }
                        }}>Submit</button>
                        <button className="modal-button red-button"     onClick={() => {
                            setBudgetInput(0)
                            setShowConfirmationModal(true)
                        }}>Delete Budget</button>
                        {showConfirmationModal && (
                            <Modal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
                                <div className="confirmation-modal">
                                    <h2>Confirm Submission</h2>
                                    <p>{budgetInput > 0 ? "Are you sure you want to submit this budget?" : "Are you sure you want to delete your budget?"}</p>
                                    <p style={{ color: 'green' }}>{budgetInput > 0 ? "New budget: $"+budgetInput : "There will be no budget for this month!"}</p>
                                    <button className="modal-button green-button" onClick={confirmSubmit}>Confirm</button>
                                    <button className="modal-button red-button" onClick={() => setShowConfirmationModal(false)}>Cancel</button>
                                </div>
                            </Modal>
                        )}
                        {monthlyBudgets && monthlyBudgets.budgets && monthlyBudgets.budgets.length > currentMonth ?
                            <div className="modal-current-budget">
                                Current Budget: {monthlyBudgets.budgets[currentMonth] ? monthlyBudgets.budgets[currentMonth] : "No budget set"}
                            </div>
                            : <div className="modal-current-budget">No budget set for this month.</div>
                        }
                        <div className="financial-tips">
                            <h3>Did you know?</h3>
                            <p>If you spend money... YOU LOSE MONEY!</p>
                            <img src="https://i.imgflip.com/4cwqqv.jpg" alt="Nice Picture" style={{ width: '30%'}} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Calendar;

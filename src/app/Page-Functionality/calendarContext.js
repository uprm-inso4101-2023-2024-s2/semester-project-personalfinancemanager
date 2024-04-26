import React, { createContext, useContext, useState } from 'react';

export const CalendarContext = createContext(false);
export const useCalendar = () => useContext(CalendarContext);

export default function CalendarProvider({ children }){
    const [showCalendar, setShowCalendar] = useState(false);
    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    return (
        <CalendarContext.Provider value={{ showCalendar, toggleCalendar }}>
            { children }
        </CalendarContext.Provider>
    );
};
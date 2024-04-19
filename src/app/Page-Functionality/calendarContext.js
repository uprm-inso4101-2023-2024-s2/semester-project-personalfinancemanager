import React, { Children, createContext, useContext, useState } from 'react';

export const CalendarContext = createContext();
export const useCalendar = () => useContext(CalendarContext);

export default function CalendarProvider({ children}){
    const [showCalendar, setShowCalendar] = useState(false);
    const toggleCalendar = () => {
        setShowCalendar((prev) => !prev);
    };

    return (
        <CalendarContext.Provider value={{ showCalendar, toggleCalendar}}>
            {Children}
        </CalendarContext.Provider>
    );
};
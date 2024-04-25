'use client'
import { useState, useContext } from 'react';
import { authContext } from "./Login/auth-context";
import AddMenu from './AddMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCalendar } from './calendarContext';


function Nav() {
  const { user, loading, logout } = useContext(authContext);
  const { toggleCalendar } = useCalendar();
  const [isCalendarShown, setIsCalendarShown] = useState(false);

  const handleClick = (action) => {
    switch (action) {
      case 'Graphs':
        // Add logic 
        break;
      case 'support':
        // Add logic 
        break;
      case 'account':
        // Add logic 
        break;
      case 'calendar':
        toggleCalendar();
        setIsCalendarShown(prev => !prev);
        break;
      case 'home':
        if(isCalendarShown){
          setIsCalendarShown(prev => !prev);
         toggleCalendar();
        }
      default:
        break;
    }
   };

   return (
     <header className="container max-w-full px-20 mx-auto bg-custom-gray py-4">
       <div className="flex items-center justify-between">
         {/* Left side of the navigation */}
         {user && !loading && (
          <div className="flex items-center gap-4 ml-12">
            <div>
              <AddMenu />
            </div>
            <span className="text-white ml-10 text-xl">Personal Finance Manager</span>
          </div>
        )}
        {/* Right side of the navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <button onClick={() => handleClick('calendar')} className="btn mr-2">Calendar</button>
            <button onClick={() => handleClick('graphs')} className="btn mr-2">Graphs</button>
            <button onClick={() => handleClick('support')} className="btn mr-2">Support</button>
            <button onClick={() => handleClick('account')} className="btn">Account</button>
            <button onClick={logout} className="btn btn-danger mr-4">
              Sign out
            </button>
            {/* Add more buttons as needed */}
          </nav>
        )}
      </div>
    </header>
  );
}
export default Nav;
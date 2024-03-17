'use client'
import React, { useState } from 'react';
import { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { authContext } from "./auth-context";


function AddMenu() {
  const { user, loading, logout } = useContext(authContext); 

  const [isOpen, setIsOpen] = useState(false);

  const [language, setLanguage] = useState('Español'); // State for language

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = (action) => {
    switch (action) {
      case 'expenses':
        // Add logic 
        break;
      case 'income':
        // Add logic 
        break;
      case 'budget':
        // Add logic 
        break;
      case 'calendar':
        // Add logic 
        break;
      case 'settings':
        // Add logic
        break;
      case 'help':
        // Add logic 
        break;
      case 'account':
        // Add logic 
        break;
      case 'logout':
        logout();
        break;
      case 'language':
        setLanguage(language === 'Español' ? 'English' : 'Español'); 
        break; 
      case 'switch':
        // Add logic for handling switch click
        break;
      default:
        break;
    }
  };

  return (
    <div className="menu relative">
    <button className="menu-icon" onClick={toggleMenu}>
      <FontAwesomeIcon icon={faBars} size="2x" className="text-white"/>
    </button>
      {isOpen && (
        <div className="overlay fixed inset-0 flex items-start justify-start bg-gray-700 bg-opacity-50">{/*White overlay*/}
          <div className="menu-items bg-white p-4 rounded-l-xl shadow-md flex flex-col justify-start h-full w-1/4">
          <div className="blue-stripe absolute top-0 left-0 h-20 bg-blue-500 w-1/4 m-0 flex items-center justify-center">
              {/* Blue stripe */}
              {user && !loading && (
                <div className="flex items-center gap-2">
                  {/* User image */}
                  <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={user.photoURL}
                      alt={user.displayName}
                    />
                  </div>
                  {/* Hi message */}
                  <small className="text-white text-xl">Hi, {user.displayName}</small>
                </div>
              )}
            </div>
            <button onClick={handleClose} className="absolute top-0 right-4 mt-4 mr-4 text-gray-500"> {/* Position the button */}
              <FontAwesomeIcon icon={faTimes} size="xl" />
            </button>
            <div className="mt-20"> {/* Adjust margin top here */}
              <div className="text-lg font-bold mb-2 text-black">Income and Expenses</div>
              <button onClick={() => handleClick('expenses')} className="block w-full text-left mb-2 text-black z-10">My expenses</button>
              <button onClick={() => handleClick('income')} className="block w-full text-left mb-2 text-black z-10">My income</button>
              <button onClick={() => handleClick('budget')} className="block w-full text-left mb-2 text-black z-10">Budgeting</button>
              <button onClick={() => handleClick('calendar')} className="block w-full text-left mb-4 text-black z-10">Calendar</button>

              <div className="text-lg font-bold mb-2 text-black">Help & Settings</div>
              <button onClick={() => handleClick('settings')} className="block w-full text-left mb-2 text-black z-10">Settings</button>
              <button onClick={() => handleClick('help')} className="block w-full text-left mb-2 text-black z-10">Help</button>
              <button onClick={() => handleClick('account')} className="block w-full text-left mb-2 text-black z-10">Account</button>
              <button onClick={() => handleClick('language')} className="block w-full text-left mb-2 text-black z-10">{language}</button>
              <button onClick={() => handleClick('switch')} className="block w-full text-left mb-2 text-black z-10">Switch account</button>
              <button onClick={() => handleClick('logout')} className="block w-full text-left text-black z-10">Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenu;
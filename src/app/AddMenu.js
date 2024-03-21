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
      case 'home':
        // Add logic 
        break;
      case 'calendar':
        // Add logic 
        break;
      case 'graphs':
        // Add logic 
        break;
      case 'settings':
        // Add logic 
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
        <div className="overlay fixed inset-0 flex items-start justify-start bg-black bg-opacity-50">{/*Black overlay*/}
        <div className="menu-items bg-black p-4 rounded-l-xl shadow-md flex flex-col justify-start h-full w-1/4">
          <div className="blue-stripe absolute top-0 left-0 h-20 bg-black w-1/4 m-0 flex items-center justify-center">
            {/* Black stripe */}
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
              <FontAwesomeIcon icon={faTimes} size="xl"  className="text-red-600"/>
            </button>
            <div className="mt-20"> {/* Adjust margin top here */}
            <button onClick={() => handleClick('expenses')} className="block w-full text-left mb-4 text-white z-10 rounded-md">Home</button>
          <button onClick={() => handleClick('income')} className="block w-full text-left mb-4 text-white z-10 rounded-md">Calendar</button>
          <button onClick={() => handleClick('budget')} className="block w-full text-left mb-4 text-white z-10 rounded-md">Graphs</button>
          <button onClick={() => handleClick('calendar')} className="block w-full text-left mb-4 text-white z-10 rounded-md">Settings</button>
                    </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenu;
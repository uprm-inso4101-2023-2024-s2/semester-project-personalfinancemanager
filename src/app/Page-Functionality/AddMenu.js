'use client'
import React, { useState } from 'react';
import { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { authContext } from "./Login/auth-context";
import {useGraph} from './graphcontext'


function AddMenu() {
  const { toggleGraphs } = useGraph(); 

  const { user, loading, logout } = useContext(authContext);

  const [isOpen, setIsOpen] = useState(false);

  const [language, setLanguage] = useState('Español'); // State for language

  const [activeButton, setActiveButton] = useState('home'); // State to track active button

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = (action) => {
    setActiveButton(action); // Set the active button when clicked
    switch (action) {
      case 'home':
        // Add logic 
        break;
      case 'calendar':
        // Add logic 
        break;
      case 'graphs':
        handleClose();
        toggleGraphs();
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
        <FontAwesomeIcon icon={faBars} size="2x" className="text-white" />
      </button>
      {isOpen && (
        <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className="menu-items bg-black p-4 rounded-l-xl shadow-md flex flex-col justify-start h-full w-1/4">
            <div className="blue-stripe absolute top-0 left-0 h-20 bg-black w-1/4 m-0 flex items-center justify-center">
              {/* Black stripe */}
              {user && !loading && (
                <div className="flex items-center gap-2">
                  {/* User image */}
                  <div className="h-[35px] w-[35px] ml-[-60px] rounded-full overflow-hidden">
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
            <button onClick={handleClose} className="absolute top-2 left-1/4 mt-4 mr-4 ml-[-40px] text-gray-500"> {/* Position the button */}
              <FontAwesomeIcon icon={faTimes} size="2x" className="text-red-600" />
            </button>
            <div className="mt-20"> {/* Adjust margin top here */}
              <button onClick={() => handleClick('home')} className={`block w-full text-left mb-4 ml-4 z-10 rounded-md ${activeButton === 'home' ? 'bg-gray-700' : ''}`}>Home</button>
              <button onClick={() => handleClick('calendar')} className={`block w-full text-left mb-4 ml-4 z-10 rounded-md ${activeButton === 'calendar' ? 'bg-gray-700' : ''}`}>Calendar</button>
              <button onClick={() => handleClick('graphs')} className={`block w-full text-left mb-4 ml-4 z-10 rounded-md ${activeButton === 'graphs' ? 'bg-gray-700' : ''}`}>Graphs</button>
              <button onClick={() => handleClick('settings')} className={`block w-full text-left mb-4 ml-4 z-10 rounded-md ${activeButton === 'settings' ? 'bg-gray-700' : ''}`}>Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenu;
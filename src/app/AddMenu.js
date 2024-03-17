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

  const handleExpensesClick = () => {
    // Add logic for handling settings click
    console.log("Settings clicked");
  };

  const handleSettingsClick = () => {
    // Add logic for handling settings click
    console.log("Settings clicked");
  };

  const handleHelpClick = () => {
    // Add logic for handling help click
    console.log("Help clicked");
  };

  const handleAccountClick = () => {
    // Add logic for handling account click
    console.log("Account clicked");
  };

  const handleLogOutClick = () => {
    logout(); 
    console.log("Account clicked");
  };

  const handleSwitchClick = () => {
    // Add logic for handling account click
    console.log("Account clicked");
  };

  const handleLanguageClick = () => {
    setLanguage(language === 'Español' ? 'English' : 'Español'); // Toggle language
    console.log("Account clicked");
  };
  

  return (
    <div className="menu relative">
      <button className="hamburger-menu" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size="2x" />
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
              <button onClick={handleExpensesClick} className="block w-full text-left mb-2 text-black z-10">My Expenses</button>
              <button onClick={handleSettingsClick} className="block w-full text-left mt-80 mb-2 text-black z-10">Settings</button>
              <button onClick={handleHelpClick} className="block w-full text-left mb-2 text-black z-10">Help</button>
              <button onClick={handleAccountClick} className="block w-full text-left mb-2 text-black z-10">Account</button>
              <button onClick={handleLogOutClick} className="block w-full text-left mb-2 text-black z-10">Log out</button>
              <button onClick={handleSwitchClick} className="block w-full text-left mb-2 text-black z-10">Switch account</button>
              <button onClick={handleLanguageClick} className="block w-full text-left text-black z-10">{language}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMenu;
'use client'
import { useContext } from "react";
import { authContext } from "./Login/auth-context";
import AddMenu from './AddMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Nav() {
  const { user, loading, encryptionPassword, logout } = useContext(authContext);
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
        //Add logic
        break;
      default:
        break;
    }
   };

   let shouldRender = user && encryptionPassword && !loading;
   return (
     <header className="container max-w-full px-20 mx-auto bg-custom-gray py-4">
       <div className="flex items-center justify-between">
         {/* Left side of the navigation */}
         {shouldRender && (
          <div className="flex items-center gap-4 ml-12">
            <div>
              <AddMenu />
            </div>
            <span className="text-white ml-10 text-xl">Personal Finance Manager</span>
          </div>
        )}
        {/* Right side of the navigation */}
        {shouldRender && (
          <nav className="flex items-center gap-4">
            <button onClick={handleClick('calendar')} className="btn mr-2">Calendar</button>
            <button onClick={handleClick('graphs')} className="btn mr-2">Graphs</button>
            <button onClick={handleClick('support')} className="btn mr-2">Support</button>
            <button onClick={handleClick('account')} className="btn">Account</button>
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
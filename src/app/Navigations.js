import { useContext } from "react";
import { authContext } from "./auth-context";
import AddMenu from './AddMenu';
import Logo from './favicon.ico';

function Nav() {
  const { user, loading, logout } = useContext(authContext);

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

  return (
    <header className="container max-w-full px-20 mx-auto bg-blue-500 py-4">
      <div className="flex items-center justify-between">
        {/* Left side of the navigation */}
        {user && !loading && (
          <div className="flex items-center gap-4 ml-12">
            <div>
              <AddMenu />
            </div>
            <span className="text-white ml-2 text-xl">Windle</span>
            <img src={Logo} alt="Logo" className="h-8 w-auto ml-4" />
          </div>
        )}

        {/* Right side of the navigation */}
        {user && !loading && (
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

import { useContext } from "react";
import { authContext } from "./auth-context";
import AddMenu from './AddMenu';
import Logo from './favicon.ico';

function Nav() {
  const { user, loading, logout } = useContext(authContext);

  const handleSupportClick = () => {
    console.log("Account clicked");
  };

  const handleGraphsClick = () => {
    console.log("Account clicked");
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
            <span className="text-white ml-2">Website Name</span>
            <img src={Logo} alt="Logo" className="h-8 w-auto ml-4" />
          </div>
        )}

        {/* Right side of the navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <button onClick={handleSupportClick} className="btn-nav">Support</button>
            <button onClick={handleGraphsClick} className="btn-nav">Account</button>
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

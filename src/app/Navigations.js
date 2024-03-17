import { useContext } from "react";
import { authContext } from "./auth-context";
import AddMenu from './AddMenu';


function Nav() {
  const { user, loading, logout } = useContext(authContext);

  return (
    <header className="container max-w-full px-20 mx-auto bg-blue-500 py-4">
      <div className="flex items-center justify-between">
        {/* Left side of the navigation */}
        {user && !loading && (
          <div className="flex items-center gap-4 ml-12">
            <div>
              <AddMenu />
            </div>
          </div>
        )}

        {/* Right side of the navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <button onClick={logout} className="btn btn-danger mr-10">
              Sign out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Nav;
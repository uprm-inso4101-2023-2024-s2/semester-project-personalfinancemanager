import { useContext } from "react";
import { authContext } from "./auth-context";
import AddMenu from './AddMenu';

function Nav() {
  const { user, loading, logout } = useContext(authContext);

  return (
    <header className="container max-w-2x1 px-6 mx-auto mt-3">
      <div className="flex items-center justify-between">
        {/* Left side of the navigation */}
        {user && !loading && (
          <div className="flex items-center gap-4">
            <div>
              <AddMenu />
            </div>
          </div>
        )}

        {/* Right side of the navigation */}
        {user && !loading && (
          <nav className="flex items-center gap-4">
            <button onClick={logout} className="btn btn-danger">
              Sign out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Nav;
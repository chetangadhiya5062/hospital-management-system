import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Navbar() {
  const { user, logout } = useContext(AppContext);
  const location = useLocation();

  const navItem = (to, label) => (
    <Link
      to={to}
      className={`transition font-medium ${
        location.pathname === to
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Health Management System
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          {user && (
            <>
              {navItem("/", "Home")}
              {navItem("/appointment", "Appointments")}
              {navItem("/upload", "Upload")}
              {navItem("/payment", "Payment")}

              {/* Admin Link */}
              {user.role === "admin" && navItem("/admin", "Admin")}

              {/* Doctor Quick Access */}
              {user.role === "doctor" && (
                <>
                  {navItem("/doctor", "Dashboard")}

                  <Link
                    to="/doctor/profile"
                    className={`transition font-semibold ${
                      location.pathname === "/doctor/profile"
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    My Profile
                  </Link>
                </>
              )}
            </>
          )}

          {!user && navItem("/login", "Login")}

          {/* Role Badge */}
          {user && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
              {user.role.toUpperCase()}
            </span>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // profile icon

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // dummy name for UI purpose (in real app this comes from backend/user data)
  const userName = "Shivam"; 

  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About us" },
    { to: "/team", label: "Our Team" },
    { to: "/vision", label: "Our Vision" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-black bg-opacity-70 text-white px-6 py-3 flex items-center justify-between backdrop-blur-md">
      {/* Center Links */}
      <div className="flex space-x-6">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <div key={link.to} className="relative">
              <Link
                to={link.to}
                className={`pb-1 hover:text-gray-300 transition ${
                  isActive ? "text-white" : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
              {isActive && (
                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-amber-300"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right - Auth/Profile */}
      <div className="flex items-center space-x-4">
        {token ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition"
            >
              <FaUserCircle className="text-xl" />
              <span className="text-sm font-medium">{userName}</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium my-auto hover:text-amber-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-amber-400 text-black px-3 py-1 rounded-md hover:bg-amber-500 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

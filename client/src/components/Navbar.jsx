import React, { useContext, useEffect, useState } from "react";
import { FiEdit2, FiLogOut, FiMoon, FiSun } from "react-icons/fi"; // Import icons
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { logout } from "../services/authenticationsServices";

const Navbar = () => {
  const { user, logoutWithContext } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check local storage for dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logoutWithContext();
    logout();
  };

  const handleProfileClick = () => {
    if (user && user._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  const getDisplayName = (fullName) => {
    if (!fullName) return "";
    const nameParts = fullName.split(" ");
    let n = nameParts.length;
    const lastName = nameParts[n - 1];
    const firstName = nameParts[0];

    // Ensure the name displayed is at least 3 characters long
    return firstName.length >= 3 ? firstName : lastName;
  };

  return (
    <nav className="bg-cusLightBG dark:bg-cusLightDarkBG px-4 py-2 flex justify-between items-center">
      <Link
        to="/"
        className="text-xl font-bold text-cusPrimaryColor dark:text-cusSecondaryColor"
      >
        My Blog
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-2">
            <span
              className="text-cusPrimaryColor dark:text-cusSecondaryColor cursor-pointer capitalize"
              onClick={handleProfileClick}
            >
              {getDisplayName(user.fullname)}
            </span>
            <button
              onClick={() => navigate("/create-post")}
              className=" flex text-cusSecondaryColor dark:text-cusSecondaryColor hover:text-cusSecondaryLightColor "
            >
              <p className="hidden md:block">Write</p>
              <FiEdit2 className="md:hidden" size={20} />
            </button>

            {/* Show logout text on desktop, icons on mobile */}
            <button
              onClick={handleLogout}
              className="text-cusSecondaryColor dark:text-cusSecondaryColor hover:text-cusSecondaryLightColor hidden md:block"
            >
              Logout
            </button>
            <button
              onClick={handleLogout}
              className="text-cusSecondaryColor dark:text-cusSecondaryColor hover:text-cusSecondaryLightColor  md:hidden"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-cusSecondaryColor dark:text-cusSecondaryColor hover:text-cusSecondaryLightColor"
          >
            Login
          </button>
        )}
        <button
          onClick={toggleDarkMode}
          className="text-cusPrimaryColor dark:text-cusSecondaryColor hover:text-cusSecondaryColor"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

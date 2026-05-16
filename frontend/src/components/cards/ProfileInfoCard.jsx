import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return user && (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 rounded-full pl-2 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <div className="relative">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-8 h-8 object-cover rounded-full border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
              {getInitials(user.name)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="hidden sm:flex flex-col items-start pr-1">
          <div className="text-sm font-semibold text-gray-900 leading-tight">
            {user.name || "User"}
          </div>
        </div>

        <LuChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center gap-3">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 border border-gray-200 rounded-full object-cover bg-white"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 truncate">
                  {user.name || "User"}
                </div>
                <div className="text-xs font-medium text-gray-500 truncate">
                  {user.email || "user@example.com"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 flex flex-col gap-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <LuUser className="w-4 h-4" />
              Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LuLogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoCard;
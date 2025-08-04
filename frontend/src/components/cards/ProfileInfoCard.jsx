import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return user && (
    <div className="relative">
      {/* Main Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm hover:bg-white border border-slate-200/50 hover:border-slate-300 rounded-full px-4 py-2 transition-all duration-300 shadow-sm hover:shadow-md group"
      >
        {/* Profile Avatar */}
        <div className="relative">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-indigo-300 transition-all duration-300"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-slate-200 group-hover:ring-indigo-300 transition-all duration-300">
              {getInitials(user.name)}
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:flex flex-col items-start">
          <div className="text-sm font-semibold text-slate-800 leading-tight">
            {user.name || "User"}
          </div>
          <div className="text-xs text-slate-500">
            {user.email ? user.email.split('@')[0] : "Account"}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <LuChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {user.name || "User"}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {user.email || "user@example.com"}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
              >
                <LuUser className="w-4 h-4" />
                Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LuLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfoCard;
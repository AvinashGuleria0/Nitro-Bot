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
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 bg-white sketch-border hover:translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_0px_#000] hover:shadow-none px-3 py-1 group"
      >
        <div className="relative">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-10 h-10 object-cover border-2 border-black rounded-lg"
            />
          ) : (
            <div className="w-10 h-10 bg-[var(--color-accent-pink)] border-2 border-black rounded-lg flex items-center justify-center text-black font-black text-sm">
              {getInitials(user.name)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[var(--color-accent-green)] rounded-full border-2 border-black"></div>
        </div>

        <div className="hidden sm:flex flex-col items-start pr-2">
          <div className="text-[14px] font-black text-black leading-tight">
            {user.name || "User"}
          </div>
          <div className="text-xs font-bold text-[var(--color-primary)]">
            {user.email ? user.email.split('@')[0] : "Account"}
          </div>
        </div>

        <LuChevronDown 
          className={`w-5 h-5 text-black transition-transform duration-300 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-64 bg-white sketch-border shadow-[4px_4px_0px_0px_#000] z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b-2 border-black bg-[var(--color-accent-yellow)]">
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-12 h-12 border-2 border-black rounded-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[var(--color-accent-pink)] border-2 border-black rounded-lg flex items-center justify-center text-black font-black">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-black truncate">
                    {user.name || "User"}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {user.email || "user@example.com"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-black text-black hover:bg-[var(--color-accent-blue)] border-2 border-transparent hover:border-black rounded-lg transition-colors duration-200"
              >
                <LuUser className="w-4 h-4 font-black" />
                Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-black text-black hover:bg-[var(--color-accent-pink)] border-2 border-transparent hover:border-black rounded-lg transition-colors duration-200"
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
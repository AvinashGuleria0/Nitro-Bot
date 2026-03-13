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
        className="flex items-center gap-3 bg-[var(--color-accent-blue)] sketch-border px-4 py-2 transition-transform duration-300 hover:-translate-y-1 shadow-[2px_2px_0px_0px_#000] group"
      >
        <div className="relative">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-10 h-10 object-cover sketch-border bg-white"
            />
          ) : (
            <div className="w-10 h-10 bg-[var(--color-accent-pink)] sketch-border flex items-center justify-center text-black font-black text-sm">
              {getInitials(user.name)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-accent-green)] border-2 border-black"></div>
        </div>

        <div className="hidden sm:flex flex-col items-start bg-white/80 px-2 py-1 sketch-border">
          <div className="text-sm font-black text-black leading-tight">
            {user.name || "User"}
          </div>
          <div className="text-xs font-bold text-slate-800">
            {user.email ? user.email.split('@')[0] : "Account"}
          </div>
        </div>

        <LuChevronDown 
          className={`w-5 h-5 text-black font-black transition-transform duration-300 ${
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
          
          <div className="absolute right-0 top-full mt-4 w-64 bg-white sketch-border sketch-shadow-lg z-20 overflow-hidden">
            <div className="p-4 border-b-4 border-black bg-[var(--color-accent-yellow)]">
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-12 h-12 object-cover sketch-border bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[var(--color-accent-pink)] sketch-border flex items-center justify-center text-black font-black text-lg">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0 bg-white/80 px-2 py-1 sketch-border">
                  <div className="text-sm font-black text-black truncate">
                    {user.name || "User"}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {user.email || "user@example.com"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2 space-y-2 bg-[var(--color-bg)]">
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-black text-black bg-white sketch-border hover:bg-[var(--color-accent-blue)] transition-colors duration-200"
              >
                <LuUser className="w-5 h-5" />
                Dashboard
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 text-sm font-black text-black bg-white sketch-border hover:bg-[var(--color-accent-pink)] transition-colors duration-200"
              >
                <LuLogOut className="w-5 h-5" />
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
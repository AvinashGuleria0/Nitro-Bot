import React, { useState } from "react";
import { FaEye, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400 flex items-center justify-center">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className={`premium-input pr-10 ${Icon ? "!pl-10" : ""}`}
          value={value}
          onChange={(e) => onChange(e)}
        />
        {type === "password" && (
          <div className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" onClick={toggleShowPassword}>
            {showPassword ? <FaEye size={18} /> : <FaRegEyeSlash size={18} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;

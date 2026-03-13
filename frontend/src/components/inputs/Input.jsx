import React, { useState } from "react";
import { FaEye, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="mb-4">
        <label className="text-[14px] font-bold text-slate-800 mb-1 block">{label}</label>
        <div className="sketch-input flex items-center px-4 py-3 bg-white">
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-slate-400 font-medium text-slate-900"
            value={value}
            onChange={(e) => onChange(e)}
          />
          {type === "password" && (
            <>
              {showPassword ? (
                <FaEye
                  size={22}
                  className="text-primary cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              ) : (
                <FaRegEyeSlash
                  size={22}
                  className="text-slate-400 cursor-pointer"
                  onClick={() => toggleShowPassword()}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Input;

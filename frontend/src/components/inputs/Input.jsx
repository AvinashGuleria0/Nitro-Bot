import React, { useState } from "react";
import { FaEye, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div>
        <label className="text-[13px] text-slate-800">{label}</label>
        <div className="input-box">
          <input
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            className="w-full bg-transparent outline-none cursor-pointer"
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

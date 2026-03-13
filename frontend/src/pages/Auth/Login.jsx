import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";

import { UserContext } from "../../context/UserContext.jsx";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center flex items-center max-w-md mx-auto">
      <h3 className="text-3xl font-black mb-2 text-black text-center">Welcome Back</h3>
      <p className="text-sm font-bold text-slate-800 mt-[5px] mb-8 text-center bg-[var(--color-accent-yellow)] px-3 py-1 sketch-border inline-block">
        Please enter your details to log in
      </p>
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="avi@mail.com"
          type="text"
        />
        <Input
          className="w-full"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />
        {error && <p className="text-red-500 font-bold text-sm bg-red-100 p-2 sketch-border border-red-500">{error}</p>}
        <button type="submit" className="sketch-button bg-[var(--color-accent-blue)] text-black font-black w-full py-3 mt-4 text-lg">
          LOGIN
        </button>
        <p className="text-[14px] font-bold text-slate-800 mt-6 text-center">
          Don’t have an account?{" "}
          <button
            className="font-black text-black bg-[var(--color-accent-pink)] px-2 py-1 sketch-border sketch-shadow-sm ml-1 hover:translate-y-px hover:translate-x-px hover:shadow-none cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("signup");
            }}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;

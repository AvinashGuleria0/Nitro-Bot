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
    <div className="w-[90vw] md:w-[33vw] p-7 flex-col justify-center flex items-center max-w-md mx-auto bg-white sketch-border sketch-shadow-sm mt-8">
      <h3 className="text-2xl font-black mb-2 text-black inline-block bg-[var(--color-accent-pink)] px-4 py-1 sketch-border shadow-[2px_2px_0px_0px_#000] -rotate-2">
        Welcome Back
      </h3>
      <p className="text-sm text-slate-800 font-bold mt-[5px] mb-6 border-b-2 border-dashed border-black pb-2">
        Please enter your details to log in
      </p>
      <form onSubmit={handleLogin} className="w-full">
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
        {error && <p className="text-red-500 font-bold text-xs pb-2.5 bg-[var(--color-accent-pink)] p-2 sketch-border mb-2">{error}</p>}
        <button type="submit" className="btn-primary w-full mt-2">
          LOGIN
        </button>
        <p className="text-[13px] font-bold text-slate-800 mt-4 text-center">
          Don’t have an account?{" "}
          <button
            type="button"
            className="font-black text-black underline decoration-2 cursor-pointer hover:bg-[var(--color-accent-yellow)] px-1"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;

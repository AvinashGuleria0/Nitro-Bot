import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext.jsx";
import { motion } from "framer-motion";
import { useGoogleLogin } from '@react-oauth/google';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
          token: tokenResponse.access_token,
        });

        const { token } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser(response.data);
          navigate("/dashboard");
        }
      } catch (err) {
        console.error(err);
        setError("Google Login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google Login failed.")
  });

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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full px-6 py-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h3>
        <p className="text-gray-500">Sign in to continue your interview prep.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="name@example.com"
          type="text"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100"
          >
            {error}
          </motion.p>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className="premium-btn"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="text-sm text-gray-400">or continue with</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* For Google Login, using the standard Google component is easiest to get the idToken for the backend */}
      <div className="mt-6">
        <button 
          type="button"
          onClick={() => googleLogin()}
          className="premium-btn-secondary"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-8 text-center">
        Don’t have an account?{" "}
        <button
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage("signup");
          }}
        >
          Sign Up
        </button>
      </p>
    </motion.div>
  );
};

export default Login;

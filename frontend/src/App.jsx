import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import LiveInterview from "./pages/LiveInterview/LiveInterview";
import FeedbackReport from "./pages/LiveInterview/FeedbackReport";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/interview-prep/:sessionId"
            element={<InterviewPrep />}
          />
          <Route 
            path="/interview/:sessionId/live" 
            element={<LiveInterview />} 
          />
          <Route 
            path="/interview/:sessionId/feedback" 
            element={<FeedbackReport />} 
          />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;

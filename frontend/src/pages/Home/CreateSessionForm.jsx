import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/inputs/Input";
import { LuSparkles, LuBriefcase, LuClock, LuTarget, LuFileText } from "react-icons/lu";
import SpinnerLoader from "../../components/loaders/SpinnerLoader";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all the required fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 11,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions: generatedQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
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
    <div className="w-full px-2 sm:px-4 py-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white">
          <LuSparkles className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Create AI Interview
        </h3>
        <p className="text-sm text-gray-500 mt-2 mx-auto leading-relaxed max-w-[90%]">
          Fill out your details to unlock a personalized set of AI-generated questions.
        </p>
      </div>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-1 px-1">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="e.g., Full-Stack Developer"
          type="text"
          icon={LuBriefcase}
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="e.g., 2"
          type="number"
          icon={LuClock}
        />

        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to Focus On"
          placeholder="e.g., React, Node.js"
          type="text"
          icon={LuTarget}
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description (Optional)"
          placeholder="Any specific goals for this session"
          type="text"
          icon={LuFileText}
        />

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <p className="text-red-600 font-medium text-sm bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold mt-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed group"
          disabled={isLoading}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
          
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-2 z-10"
            >
              <SpinnerLoader /> 
              <span>Generating AI Questions...</span>
            </motion.div>
          ) : (
            <span className="z-10 flex items-center gap-2">
              Start Interview Journey
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;

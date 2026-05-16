import React from "react";
import { LuPlay } from "react-icons/lu";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onStartInterview
}) => {
  return (
    <div className="bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-0">
        <div className="py-12 flex flex-col md:flex-row justify-between items-center relative z-10">
          
          {/* Left side: Info */}
          <div className="flex-1 mb-6 md:mb-0">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{role}</h2>
              <p className="text-sm font-medium text-gray-500 mt-2 max-w-2xl leading-relaxed">{topicsToFocus}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                {experience} {experience == 1 ? "Year" : "Years"} Exp
              </div>
              <div className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
                {questions.length} Q&A
              </div>
              <div className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                Updated {lastUpdated}
              </div>
            </div>
          </div>

          {/* Right side: Action Button */}
          <div className="w-full md:w-auto">
            <button 
              onClick={onStartInterview}
              className="w-full md:w-auto bg-blue-600 text-white font-medium px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <LuPlay className="w-3.5 h-3.5 text-white ml-0.5" />
              </div>
              Take Live Interview
            </button>
          </div>

        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-[-20px] right-[-50px] w-64 h-64 bg-blue-400 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-50px] right-[100px] w-64 h-64 bg-purple-400 rounded-full blur-[80px]" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;

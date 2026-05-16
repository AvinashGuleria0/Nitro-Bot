import React, { useState } from "react";
import { motion } from "framer-motion";
import { LuClock, LuUser, LuInfo, LuArrowRight } from "react-icons/lu";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";

const SetupInterviewModal = ({ isOpen, onClose, sessionId }) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState("10"); // in minutes
  const [persona, setPersona] = useState("standard");

  const handleStartInterview = () => {
    // Navigate to live interview page with query params (Phase 3)
    navigate(`/interview/${sessionId}/live?duration=${duration}&persona=${persona}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Interview Setup">
      <div className="p-6 w-full space-y-8 bg-white">
        
        {/* Rules & Info Section */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <LuInfo className="text-blue-600 w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How it works</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
              <li>This is a live voice-based mock interview.</li>
              <li>You can speak normally. The AI will listen, evaluate, and respond.</li>
              <li><span className="font-semibold">Stuck?</span> Just ask Nitro for a hint or help.</li>
            </ul>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="space-y-6">
          
          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <LuClock className="text-gray-500" />
              Interview Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["5", "10", "15"].map((time) => (
                <button
                  key={time}
                  onClick={() => setDuration(time)}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    duration === time 
                      ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {time} min
                </button>
              ))}
            </div>
          </div>

          {/* Persona */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <LuUser className="text-gray-500" />
              Interviewer Persona
            </label>
            <div className="space-y-3">
              {[
                { id: "standard", label: "Balanced & Professional", desc: "Standard mix of behavioral and technical." },
                { id: "strict", label: "Strict Technical", desc: "Focuses deeply on code and edge cases." },
                { id: "friendly", label: "Friendly HR", desc: "Focuses on culture fit and communication." }
              ].map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    persona === p.id
                      ? "bg-blue-50 border-blue-600 shadow-sm"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div>
                    <h4 className={`font-semibold ${persona === p.id ? "text-blue-900" : "text-gray-900"}`}>
                      {p.label}
                    </h4>
                    <p className={`text-xs mt-1 ${persona === p.id ? "text-blue-700" : "text-gray-500"}`}>
                      {p.desc}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    persona === p.id ? "border-blue-600" : "border-gray-300"
                  }`}>
                    {persona === p.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-gray-100">
          <button 
            onClick={handleStartInterview}
            className="w-full bg-gray-900 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] shadow-md shadow-gray-900/10"
          >
            Start Live Interview
            <LuArrowRight />
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default SetupInterviewModal;

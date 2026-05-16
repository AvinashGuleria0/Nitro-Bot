import React, { useState, useContext } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuBrain, LuTarget, LuZap } from "react-icons/lu";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import Modal from "../components/Modal";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";
import { UserContext } from "../context/UserContext";
import HERO_IMG from '../assets/hero-image.png'
import { motion } from "framer-motion";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  const featureIcons = [LuBrain, LuTarget, LuZap, LuSparkles, LuBrain, LuTarget];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-200">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LuSparkles className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">NitroBot</span>
          </div>
          
          <div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gray-900 text-white hover:bg-gray-800 transition-colors px-6 py-2.5 rounded-full font-medium text-sm"
                onClick={() => setOpenAuthModel(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-1/2 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-2">
                <LuSparkles className="text-blue-500" />
                <span>Next-Gen Interview Prep</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gray-900">
                Master your next interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI precision.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience real-time voice interviews, get deeply personalized feedback, and track your progress. NitroBot turns anxiety into confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button
                  onClick={handleCTA}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                >
                  Start Practicing Free
                </button>
                <button 
                  className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-all active:scale-[0.98]"
                >
                  View Features
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl transform rotate-2 scale-105 opacity-50"></div>
                <img 
                  src={HERO_IMG} 
                  alt="Dashboard Preview" 
                  className="relative z-10 w-full rounded-2xl premium-shadow border border-gray-100 bg-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Alternating Layout (No Blocks) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-1/2 -right-64 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 -left-64 w-[600px] h-[600px] bg-purple-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed to simulate real-world conditions and dramatically improve your performance.
            </p>
          </div>

          <div className="space-y-32 max-w-6xl mx-auto">
            {APP_FEATURES.slice(0, 4).map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={feature.id}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}
                >
                  {/* Icon/Graphic Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex justify-center"
                  >
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-full blur-2xl opacity-70 scale-150"></div>
                      <div className="relative z-10 w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-3xl shadow-2xl shadow-blue-900/10 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Icon className="w-16 h-16 lg:w-20 lg:h-20 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Text Side */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="w-full lg:w-1/2 space-y-6 text-center lg:text-left"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-2">
                      <span className="font-bold text-lg">0{index + 1}</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="pt-4">
                      <button className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 mx-auto lg:mx-0 group">
                        Explore this feature 
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <LuSparkles className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NitroBot</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            Built with purpose to help you land your dream job.
            <br />© 2026 NitroBot. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="p-2">
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>

    </div>
  );
};

export default LandingPage;
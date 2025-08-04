import React, { useState, useContext } from "react";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import Modal from "../components/Modal";
import ProfileInfoCard from "../components/cards/ProfileInfoCard";
import { UserContext } from "../context/UserContext";
import HERO_IMG from '../assets/hero-image.png'

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

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        {/* Animated background elements */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-200/40 via-indigo-200/40 to-purple-200/40 blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-200/30 via-blue-200/30 to-cyan-200/30 blur-[100px] animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 pt-8 pb-12 relative z-10">
          <header className="flex justify-between items-center mb-20">
            <div className="text-2xl text-slate-800 font-bold tracking-tight">
              Nitro Bot
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white px-8 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="flex items-center gap-3 text-sm text-indigo-700 font-semibold bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200/50 w-fit shadow-sm">
                <LuSparkles className="text-indigo-600" />
                AI Powered
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl text-slate-800 font-bold leading-[1.1] tracking-tight">
                  Ace Interviews with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient-x">
                    AI-Powered
                  </span>{" "}
                  Learning
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Explore role-specific questions, expand answers as needed, and
                  dive deep into key concepts — all while organizing your prep
                  your way. From building a strong foundation to mastering
                  advanced topics, this is your all-in-one interview preparation
                  companion.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    className="bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold px-8 py-4 rounded-full hover:from-slate-900 hover:to-slate-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleCTA}
                  >
                    Get Started Free
                  </button>
                  <button className="text-slate-600 font-medium px-8 py-4 rounded-full border border-slate-300 hover:bg-white/50 hover:border-slate-400 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-2xl blur-2xl opacity-30 transform rotate-6"></div>
                <img 
                  src={HERO_IMG} 
                  alt="hero image" 
                  className="relative w-full max-w-2xl rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative w-full bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="container mx-auto px-6">
          <section className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
                Features That Matter
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to succeed in your next interview
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature, index) => (
                  <div
                    key={feature.id}
                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/50 transition-all duration-500 hover:transform hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <LuSparkles className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {APP_FEATURES.slice(3).map((feature, index) => (
                  <div
                    key={feature.id}
                    className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/50 transition-all duration-500 hover:transform hover:-translate-y-2"
                    style={{
                      animationDelay: `${(index + 3) * 100}ms`
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <LuSparkles className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-slate-800">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="text-center text-slate-500 bg-slate-50 border-t border-slate-200 p-8 mt-20">
          <p className="text-sm">
            Made with ❤️ by <span className="font-semibold text-slate-700">Avinash Guelria</span>
          </p>
        </div>
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default LandingPage;
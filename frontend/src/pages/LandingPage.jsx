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
      <div className="relative overflow-hidden bg-[var(--color-bg)] min-h-screen">
        
        <div className="container mx-auto px-6 pt-8 pb-12 relative z-10">
          <header className="flex justify-between items-center mb-20 sketch-border sketch-shadow bg-white p-4">
            <div className="text-2xl text-black font-black tracking-tight bg-[var(--color-accent-blue)] px-4 py-2 sketch-border">
              Nitro Bot
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="sketch-button bg-[var(--color-accent-pink)] text-black font-black text-sm px-8 py-3"
                onClick={() => setOpenAuthModel(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="flex items-center gap-3 text-sm text-black font-black bg-[var(--color-accent-yellow)] px-4 py-2 sketch-border sketch-shadow w-fit">
                <LuSparkles className="text-black" />
                AI Powered
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl text-black font-black leading-[1.1] tracking-tight">
                  Ace Interviews with{" "}
                  <span className="inline-block bg-[var(--color-accent-green)] px-2 sketch-border sketch-shadow-sm rotate-2 my-2">
                    AI-Powered
                  </span>{" "}
                  Learning
                </h1>
                
                <p className="text-xl text-slate-800 font-medium leading-relaxed max-w-lg border-l-4 border-black pl-4">
                  Explore role-specific questions, expand answers as needed, and
                  dive deep into key concepts. From building a strong foundation to mastering
                  advanced topics, this is your all-in-one interview preparation companion.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <button
                    className="sketch-button bg-[var(--color-accent-blue)] text-black font-black px-8 py-4 text-lg"
                    onClick={handleCTA}
                  >
                    Get Started Free
                  </button>
                  <button className="sketch-button bg-white text-black font-black px-8 py-4 text-lg">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <img 
                  src={HERO_IMG} 
                  alt="hero image" 
                  className="relative w-full max-w-2xl sketch-border sketch-shadow-lg transform hover:-rotate-1 transition-transform duration-300 bg-white" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative w-full bg-[var(--color-accent-yellow)] py-20 border-t-4 border-black">
        <div className="container mx-auto px-6">
          <section className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-black tracking-tight inline-block bg-white px-6 py-2 sketch-border sketch-shadow -rotate-1">
                Features That Matter
              </h2>
              <p className="text-xl font-bold text-slate-800 max-w-2xl mx-auto pt-4">
                Everything you need to succeed in your next interview
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature, index) => (
                  <div
                    key={feature.id}
                    className="group sketch-border sketch-shadow bg-white p-8 transition-all duration-300 hover:translate-y-1 hover:shadow-none"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="w-14 h-14 bg-[var(--color-accent-pink)] sketch-border flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 shadow-[2px_2px_0px_0px_#000] mb-6">
                      <LuSparkles className="text-black text-2xl" />
                    </div>
                    <h3 className="text-xl font-black mb-4 text-black">
                      {feature.title}
                    </h3>
                    <p className="text-slate-800 font-medium leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {APP_FEATURES.slice(3).map((feature, index) => (
                  <div
                    key={feature.id}
                    className="group sketch-border sketch-shadow bg-white p-8 transition-all duration-300 hover:translate-y-1 hover:shadow-none"
                    style={{
                      animationDelay: `${(index + 3) * 100}ms`
                    }}
                  >
                    <div className="w-14 h-14 bg-[var(--color-accent-blue)] sketch-border flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300 shadow-[2px_2px_0px_0px_#000] mb-6">
                      <LuSparkles className="text-black text-2xl" />
                    </div>
                    <h3 className="text-xl font-black mb-4 text-black">
                      {feature.title}
                    </h3>
                    <p className="text-slate-800 font-medium leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer */}
        <div className="text-center font-black text-black bg-[var(--color-accent-blue)] border-t-4 border-black p-8 mt-20 sketch-shadow-lg relative -bottom-2">
          <p className="text-lg">
            Made with <span className="text-red-500">❤️</span> by Avinash Guleria
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
        <div className="sketch-border p-4 bg-white rounded-xl">
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
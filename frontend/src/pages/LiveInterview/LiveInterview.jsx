import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuMic, LuSquare, LuPhoneOff, LuVolume2 } from 'react-icons/lu';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const LiveInterview = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const duration = searchParams.get('duration') || '10';
  const persona = searchParams.get('persona') || 'standard';

  const [sessionData, setSessionData] = useState(null);
  const [status, setStatus] = useState('initializing'); // initializing, idle, listening, thinking, speaking, finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(parseInt(duration) * 60);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied.");
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
        if (response.data && response.data.session) {
          setSessionData(response.data.session);
          setStatus('idle');
        }
      } catch (error) {
        toast.error("Failed to load session details.");
        navigate('/dashboard');
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  // Timer
  useEffect(() => {
    if (status === 'initializing' || status === 'finished') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const speakText = (text, callback) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Female')));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 0.95; // Slightly slower for better comprehension
    utterance.pitch = persona === 'strict' ? 0.8 : (persona === 'friendly' ? 1.2 : 1.0);

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => {
      setStatus('idle');
      if (callback) callback();
    };

    synthRef.current.speak(utterance);
  };

  const startNextQuestion = () => {
    if (!sessionData || !sessionData.questions) return;
    if (currentQuestionIndex >= sessionData.questions.length) {
      endInterview();
      return;
    }

    const nextQ = sessionData.questions[currentQuestionIndex];
    setTranscript('');
    speakText(nextQ.question);
  };

  const startInterview = () => {
    let intro = "Welcome to your mock interview.";
    if (persona === 'friendly') intro = "Hi there! I'm so glad you could join me today. Let's get started with your mock interview.";
    if (persona === 'strict') intro = "Let's begin the technical assessment. Please answer the following questions clearly and concisely.";

    speakText(intro, startNextQuestion);
  };

  const toggleListening = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
      setStatus('thinking');
      
      // Mock AI Evaluation Delay
      setTimeout(() => {
        const feedback = "Got it. Moving on to the next question.";
        setCurrentQuestionIndex(prev => prev + 1);
        speakText(feedback, startNextQuestion);
      }, 2000);

    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setStatus('listening');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const endInterview = () => {
    setStatus('finished');
    recognitionRef.current?.stop();
    speakText("This concludes our interview. Thank you for your time. Your feedback report is being generated.");
    // For now, redirect back to dashboard after a delay
    setTimeout(() => navigate('/dashboard'), 5000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getOrbVisuals = () => {
    switch (status) {
      case 'listening': return 'scale-110 bg-green-400 shadow-[0_0_80px_rgba(74,222,128,0.6)] animate-pulse';
      case 'speaking': return 'scale-100 bg-cyan-400 shadow-[0_0_100px_rgba(34,211,238,0.8)]';
      case 'thinking': return 'scale-95 bg-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.5)] animate-bounce';
      case 'finished': return 'scale-90 bg-gray-400 opacity-50';
      default: return 'scale-100 bg-blue-500 shadow-[0_0_60px_rgba(59,130,246,0.5)]'; // idle
    }
  };

  if (status === 'initializing') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-pulse">Initializing Interview Engine...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans overflow-hidden flex flex-col relative">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <div className="bg-gray-800 rounded-full px-4 py-2 text-sm font-semibold text-gray-300 border border-gray-700">
            {persona.charAt(0).toUpperCase() + persona.slice(1)} Persona
          </div>
          <div className="bg-gray-800 rounded-full px-4 py-2 text-sm font-mono font-bold text-gray-300 border border-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <button 
          onClick={endInterview}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full font-medium transition-colors border border-red-500/20 flex items-center gap-2"
        >
          <LuPhoneOff /> End Session
        </button>
      </div>

      {/* Main Orb Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        
        {/* Status Text */}
        <div className="mb-12 h-8">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 font-medium tracking-widest uppercase text-sm"
          >
            {status === 'idle' ? 'Ready' : status}
          </motion.div>
        </div>

        {/* AI Orb */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
          {/* Audio ripples */}
          {(status === 'listening' || status === 'speaking') && (
            <>
              <div className="absolute inset-0 border border-current rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-[-40px] border border-current rounded-full animate-ping opacity-10" style={{ animationDuration: '2s' }} />
            </>
          )}
          
          <div className={`w-48 h-48 rounded-full transition-all duration-700 ease-in-out ${getOrbVisuals()}`}>
            {status === 'speaking' && (
              <div className="w-full h-full flex items-center justify-center">
                 <LuVolume2 className="text-white/50 w-12 h-12" />
              </div>
            )}
          </div>
        </div>

        {/* Current Question / Transcript */}
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="min-h-[100px]">
            <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed">
              {status === 'speaking' 
                ? sessionData?.questions[currentQuestionIndex]?.question 
                : (transcript || <span className="text-gray-600">"{status === 'listening' ? "Listening..." : "Waiting for your response..."}"</span>)
              }
            </h2>
          </div>
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center z-20 bg-gradient-to-t from-gray-900 to-transparent">
        {currentQuestionIndex === 0 && status === 'idle' && !transcript ? (
          <button
            onClick={startInterview}
            className="bg-white text-black font-bold px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            Start Interview
          </button>
        ) : (
          <button
            onClick={toggleListening}
            disabled={status === 'speaking' || status === 'thinking' || status === 'finished'}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              status === 'listening' 
                ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                : 'bg-white hover:bg-gray-100 text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]'
            } ${status === 'speaking' || status === 'thinking' || status === 'finished' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {status === 'listening' ? <LuSquare className="w-8 h-8 text-white" /> : <LuMic className="w-8 h-8" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveInterview;

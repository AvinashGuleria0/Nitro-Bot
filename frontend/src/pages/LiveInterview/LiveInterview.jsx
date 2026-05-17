import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMic, LuSquare, LuPhoneOff } from 'react-icons/lu';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

// --- Waveform: individual bars, each with independent height animation ---
// Heights are pre-computed per bar to avoid Math.random() re-running on every render
const BAR_CONFIGS = Array.from({ length: 32 }, (_, i) => ({
  duration: 0.4 + (i % 7) * 0.12,
  delay: (i % 5) * 0.08,
  maxH: 30 + (i % 8) * 8,  // px, different peaks per bar
}));

const AudioWaveform = ({ isActive, color = '#4ade80' }) => {
  return (
    <div className="flex items-end justify-center gap-[3px] h-16 w-full max-w-md mx-auto">
      {BAR_CONFIGS.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-full flex-shrink-0"
          style={{
            width: 4,
            backgroundColor: color,
            boxShadow: isActive ? `0 0 6px ${color}` : 'none',
          }}
          animate={
            isActive
              ? { height: [4, bar.maxH, 4] }
              : { height: 4 }
          }
          transition={
            isActive
              ? {
                  repeat: Infinity,
                  duration: bar.duration,
                  delay: bar.delay,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};

// --- Robot Face ---
const RobotFace = ({ status }) => {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isThinking = status === 'thinking';

  const eyeColor =
    isSpeaking ? '#22d3ee' :
    isListening ? '#4ade80' :
    isThinking ? '#a855f7' : '#6b7280';

  const eyeGlow =
    isSpeaking ? '0 0 16px #22d3ee' :
    isListening ? '0 0 16px #4ade80' :
    isThinking ? '0 0 16px #a855f7' : 'none';

  const eyeScaleY =
    isThinking ? [1, 0.15, 1] :
    isListening ? [1, 1.15, 1] :
    isSpeaking ? 1 : [1, 0.08, 1]; // idle blink

  const eyeDuration =
    isThinking ? 1.2 :
    isListening ? 0.9 :
    isSpeaking ? 1 : 3.5;

  return (
    <div className="relative w-52 h-52 bg-gray-900/90 backdrop-blur-xl rounded-[2.5rem] border border-gray-700/60 shadow-2xl flex flex-col items-center justify-center gap-7">
      {/* Subtle inner glow ring */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-30 transition-all duration-700"
        style={{ boxShadow: `inset 0 0 40px ${eyeColor}` }}
      />

      {/* Eyes */}
      <div className="flex gap-9 z-10">
        {[0, 1].map((idx) => (
          <motion.div
            key={idx}
            animate={{ scaleY: eyeScaleY }}
            transition={{
              repeat: Infinity,
              duration: eyeDuration,
              delay: idx === 1 && isThinking ? 0.15 : 0,
              ease: 'easeInOut',
              times: !isSpeaking && !isListening && !isThinking
                ? [0, 0.03, 0.07, 1]
                : [0, 0.5, 1],
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: eyeColor,
              boxShadow: eyeGlow,
              transition: 'background-color 0.5s, box-shadow 0.5s',
            }}
          />
        ))}
      </div>

      {/* Mouth */}
      <div className="flex items-end justify-center gap-1.5 h-9 w-24 z-10">
        {isSpeaking ? (
          [0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ['15%', '100%', '15%'] }}
              transition={{
                repeat: Infinity,
                duration: 0.35 + i * 0.09,
                delay: i * 0.07,
                ease: 'easeInOut',
              }}
              style={{
                width: 7,
                borderRadius: 4,
                backgroundColor: '#22d3ee',
                boxShadow: '0 0 8px #22d3ee',
              }}
            />
          ))
        ) : isListening ? (
          <motion.div
            animate={{ width: ['35px', '65px', '35px'], height: ['3px', '7px', '3px'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            style={{
              borderRadius: 4,
              backgroundColor: '#4ade80',
              boxShadow: '0 0 10px #4ade80',
            }}
          />
        ) : isThinking ? (
          <motion.div
            animate={{ x: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: 32,
              height: 6,
              borderRadius: 4,
              backgroundColor: '#a855f7',
              boxShadow: '0 0 10px #a855f7',
            }}
          />
        ) : (
          <div style={{ width: 44, height: 5, borderRadius: 4, backgroundColor: '#374151' }} />
        )}
      </div>
    </div>
  );
};

// ==============================
//  Main Component
// ==============================
const LiveInterview = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const duration = searchParams.get('duration') || '10';
  const persona = searchParams.get('persona') || 'standard';

  const [sessionData, setSessionData] = useState(null);
  const [status, setStatus] = useState('initializing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [timeLeft, setTimeLeft] = useState(parseInt(duration) * 60);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [micDevices, setMicDevices] = useState([]);
  const [selectedMicId, setSelectedMicId] = useState('');
  const [isMicLoading, setIsMicLoading] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micEnergyActive, setMicEnergyActive] = useState(false);
  const [activeMicLabel, setActiveMicLabel] = useState('');
  const [useRawMic, setUseRawMic] = useState(false);
  const [sttLanguage, setSttLanguage] = useState('en-IN'); // Better default for Indian accents
  const [aiMessage, setAiMessage] = useState(''); // Tracks current spoken text
  // Use a ref to track current question index inside callbacks (avoids stale closure)
  const currentQuestionIndexRef = useRef(0);
  const transcriptRef = useRef('');             // always-fresh final transcript (no interim)
  const accumulatedRef = useRef('');            // finalized text from previous STT sessions
  const sessionFinalsRef = useRef('');          // finalized text in the CURRENT STT session
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const isRecognitionActiveRef = useRef(false);
  const shouldBeListeningRef = useRef(false);
  const micStreamRef = useRef(null);
  const micAccessPromiseRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const meterRafRef = useRef(null);
  const micSourceRef = useRef(null);
  const restartTimerRef = useRef(null);
  const noSpeechRetryRef = useRef(0);
  const heardSpeechRef = useRef(false);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const scheduleRecognitionRestart = useCallback((reason) => {
    if (!shouldBeListeningRef.current || !recognitionRef.current) {
      return;
    }

    if (restartTimerRef.current) {
      return;
    }

    const delay = Math.min(1200 + (noSpeechRetryRef.current * 400), 2500);
    console.log('[STT] Scheduling restart', { delay, reason });
    restartTimerRef.current = setTimeout(() => {
      restartTimerRef.current = null;

      if (!shouldBeListeningRef.current || !recognitionRef.current || isRecognitionActiveRef.current) {
        return;
      }

      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('[STT Auto-restart Error]', e.message);
      }
    }, delay);
  }, []);

  const stopMicMeter = useCallback(() => {
    if (meterRafRef.current) {
      cancelAnimationFrame(meterRafRef.current);
      meterRafRef.current = null;
    }

    if (micSourceRef.current) {
      try { micSourceRef.current.disconnect(); } catch (_) {}
      micSourceRef.current = null;
    }

    if (analyserRef.current) {
      try { analyserRef.current.disconnect(); } catch (_) {}
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (_) {}
      audioContextRef.current = null;
    }

    setMicLevel(0);
    setMicEnergyActive(false);
    console.log('[Mic] Meter stopped');
  }, []);

  const resumeAudioContext = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || context.state !== 'suspended') {
      return;
    }

    context.resume().catch((err) => {
      console.error('[Mic] Failed to resume AudioContext:', err);
    });
  }, []);

  const startMicMeter = useCallback((stream) => {
    if (!stream) return;

    stopMicMeter();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const context = new AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = context;
    analyserRef.current = analyser;
    micSourceRef.current = source;

    context.resume().catch((err) => {
      console.error('[Mic] Failed to resume AudioContext:', err);
    });

    console.log('[Mic] Meter started');

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sumSquares = 0;
      for (let i = 0; i < data.length; i += 1) {
        const centered = (data[i] - 128) / 128;
        sumSquares += centered * centered;
      }
      const rms = Math.sqrt(sumSquares / data.length);
      setMicLevel(rms);
      setMicEnergyActive(rms > 0.01);
      meterRafRef.current = requestAnimationFrame(tick);
    };

    meterRafRef.current = requestAnimationFrame(tick);
  }, [stopMicMeter]);

  const stopMicStream = useCallback(() => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    stopMicMeter();
    console.log('[Mic] Stream stopped');
  }, [stopMicMeter]);

  const ensureMicAccess = useCallback(async () => {
    if (micStreamRef.current) {
      return micStreamRef.current;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return null;
    }

    if (!micAccessPromiseRef.current) {
      const baseConstraints = selectedMicId
        ? { deviceId: { ideal: selectedMicId } }
        : {};

      const audioConstraints = useRawMic
        ? {
            ...baseConstraints,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          }
        : {
            ...baseConstraints,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          };

      micAccessPromiseRef.current = navigator.mediaDevices.getUserMedia({ audio: audioConstraints })
        .then((stream) => {
          micStreamRef.current = stream;
          startMicMeter(stream);
          console.log('[Mic] Stream acquired', { deviceId: selectedMicId || 'default' });
          return stream;
        })
        .catch((err) => {
          console.error('[Mic] Failed to acquire microphone:', err);
          toast.error('Could not access microphone. Check browser permissions and input device.');
          throw err;
        })
        .finally(() => {
          micAccessPromiseRef.current = null;
        });
    }

    return micAccessPromiseRef.current;
  }, [selectedMicId, startMicMeter, useRawMic]);

  const refreshMicStream = useCallback(async () => {
    stopMicStream();
    try {
      await ensureMicAccess();
      console.log('[Mic] Stream refreshed');
    } catch (err) {
      console.error('[Mic] Failed to refresh microphone stream:', err);
    }
  }, [ensureMicAccess, stopMicStream]);

  const loadMicDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    setIsMicLoading(true);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      setMicDevices(audioInputs);
      console.log('[Mic] Devices loaded', audioInputs.map(device => device.label || device.deviceId));

      if (!selectedMicId && audioInputs.length) {
        setSelectedMicId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.error('[Mic] Failed to enumerate devices:', err);
    } finally {
      setIsMicLoading(false);
    }
  }, [selectedMicId]);

  useEffect(() => {
    const active = micDevices.find(device => device.deviceId === selectedMicId);
    setActiveMicLabel(active?.label || (selectedMicId ? 'Unknown microphone' : ''));
  }, [micDevices, selectedMicId]);

  // ---- Safe STT start/stop helpers (defined early to avoid TDZ) ----
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      console.error('[STT] recognitionRef is null — not initialized yet.');
      return;
    }
    resumeAudioContext();
    clearRestartTimer();
    noSpeechRetryRef.current = 0;
    heardSpeechRef.current = false;
    if (isRecognitionActiveRef.current) {
      setStatus('listening'); // still mark status
      console.log('[STT] Start requested but already active');
      return;
    }
    shouldBeListeningRef.current = true; // signal: we WANT to be listening
    console.log('[STT] Starting recognition');

    ensureMicAccess()
      .then(() => {
        resumeAudioContext();
        if (!shouldBeListeningRef.current || isRecognitionActiveRef.current) {
          return;
        }
        try {
          isRecognitionActiveRef.current = true;
          recognitionRef.current.start();
          setStatus('listening');
          console.log('[STT] Recognition started');
        } catch (e) {
          console.error('[STT Error] Failed to start:', e.message);
          isRecognitionActiveRef.current = false;
          shouldBeListeningRef.current = false;

          clearRestartTimer();
        }
      })
      .catch(() => {
        shouldBeListeningRef.current = false;
        clearRestartTimer();
        setStatus('idle');
        console.log('[STT] Start failed');
      });
  }, [clearRestartTimer, ensureMicAccess, resumeAudioContext]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false; // signal: we DON'T want to be listening
    clearRestartTimer();
    console.log('[STT] Stopping recognition');
    if (!recognitionRef.current) return;
    if (!isRecognitionActiveRef.current) {
      return;
    }
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error('[STT Error] Failed to stop:', e.message);
    }
  }, [clearRestartTimer]);

  const prevSttLanguage = useRef(sttLanguage);
  useEffect(() => {
    if (!recognitionRef.current) return;
    if (prevSttLanguage.current === sttLanguage) return;
    
    prevSttLanguage.current = sttLanguage;
    recognitionRef.current.lang = sttLanguage;
    console.log('[STT] Language updated', sttLanguage);

    if (isRecognitionActiveRef.current) {
      stopListening();
      setTimeout(() => startListening(), 250);
    }
  }, [sttLanguage, startListening, stopListening]);


  useEffect(() => {
    if (!selectedMicId) return;
    if (status === 'listening') {
      stopListening();
      setTimeout(() => startListening(), 250);
    } else {
      refreshMicStream();
    }
    console.log('[Mic] Selected device changed', selectedMicId);
  }, [selectedMicId, status, refreshMicStream, startListening, stopListening, useRawMic]);

  // ---- STT: init ONCE, no dependencies ----
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('[STT] Not supported in this browser.');
      toast.error('Speech recognition is not supported. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = sttLanguage;
    recognition.maxAlternatives = 1;
    console.log('[STT] Initialized', { lang: sttLanguage });

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      heardSpeechRef.current = false;
      console.log('[STT] onstart');
    };

    // KEY FIX: Chrome kills recognition after silence even with continuous=true.
    // If we SHOULD still be listening (shouldBeListeningRef), restart it.
    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      console.log('[STT] onend', { shouldBeListening: shouldBeListeningRef.current });
      if (shouldBeListeningRef.current) {
        scheduleRecognitionRestart('onend');
      }
    };
    recognition.onspeechstart = () => {
      heardSpeechRef.current = true;
      noSpeechRetryRef.current = 0;
      console.log('[STT] onspeechstart');
    };

    // sessionFinalsRef and accumulatedRef are component-level refs defined above

    recognition.onresult = (event) => {
      // Only process NEW results since the last event (use resultIndex)
      let newFinals = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinals += text + ' ';
        } else {
          currentInterim += text;
        }
      }

      // Append any newly finalized text to the session buffer
      if (newFinals) {
        sessionFinalsRef.current = (sessionFinalsRef.current + newFinals).trimEnd();
        heardSpeechRef.current = true;
        noSpeechRetryRef.current = 0;
        console.log('[STT] Final segment', newFinals.trim());
      }

      // Full display = past sessions + current session finals + current interim guess
      const pastText = accumulatedRef.current;
      const displayText = [pastText, sessionFinalsRef.current, currentInterim]
        .map(t => t.trim())
        .filter(Boolean)
        .join(' ');

      transcriptRef.current = [pastText, sessionFinalsRef.current].map(t => t.trim()).filter(Boolean).join(' ');
      setTranscript(displayText); // show interim in UI for live feedback
      console.log('[STT] Interim update', { interim: currentInterim, displayText });
      if (currentInterim) {
        heardSpeechRef.current = true;
        noSpeechRetryRef.current = 0;
      }
    };

    // When speech ends in this session, commit what was finalized to accumulatedRef
    recognition.onspeechend = () => {
      // Commit session finals to accumulated so next session starts fresh but keeps the text
      if (sessionFinalsRef.current) {
        accumulatedRef.current = [accumulatedRef.current, sessionFinalsRef.current]
          .map(t => t.trim()).filter(Boolean).join(' ');
        sessionFinalsRef.current = ''; // reset for next session
      }
      // transcriptRef always holds committed text (no interim)
      transcriptRef.current = accumulatedRef.current;
      console.log('[STT] onspeechend', { accumulated: accumulatedRef.current });
    };

    recognition.onerror = (event) => {
      console.error('[STT Error]', event.error, event);
      if (event.error === 'not-allowed') {
        console.error('[STT] PERMISSION DENIED — user blocked microphone!');
        toast.error('🎙️ Microphone access denied!\nClick the padlock icon in your browser URL bar → Allow microphone access → Refresh.', { duration: 8000 });
        shouldBeListeningRef.current = false;
        isRecognitionActiveRef.current = false;
        clearRestartTimer();
        setStatus('idle');
      } else if (event.error === 'no-speech') {
        // Chrome timed out without detecting speech — retry with backoff instead of spinning rapidly.
        isRecognitionActiveRef.current = false;
        console.log('[STT] no-speech');

        if (!heardSpeechRef.current) {
          noSpeechRetryRef.current += 1;
          if (noSpeechRetryRef.current >= 5) {
            clearRestartTimer();
            shouldBeListeningRef.current = false;
            toast.error('I could not detect your voice. Check the microphone input and press the mic button again.', { duration: 6000 });
            setStatus('idle');
            return;
          }
        } else {
          noSpeechRetryRef.current = 0;
        }

        if (!heardSpeechRef.current && noSpeechRetryRef.current % 2 === 1) {
          refreshMicStream().finally(() => {
            scheduleRecognitionRestart('no-speech');
          });
          return;
        }

        scheduleRecognitionRestart('no-speech');
      } else if (event.error === 'aborted') {
        isRecognitionActiveRef.current = false;
        console.log('[STT] aborted');
      } else {
        console.error('[STT] Unknown error:', event.error);
        isRecognitionActiveRef.current = false;
      }
    };

    recognitionRef.current = recognition;
    return () => {
      shouldBeListeningRef.current = false;
      clearRestartTimer();
      stopMicStream();
      try { recognition.stop(); } catch (_) {}
      try { synthRef.current?.cancel(); } catch (_) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearRestartTimer, scheduleRecognitionRestart, stopMicStream, refreshMicStream]); // ← Empty deps effectively, avoid sttLanguage here to prevent full rebuild

  // ---- Fetch session ----
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
        if (res.data?.session) {
          setSessionData(res.data.session);
          setStatus('idle');
        }
      } catch (err) {
        console.error('[Data Error]', err);
        toast.error('Failed to load session.');
        navigate('/dashboard');
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  // ---- Check mic permission on mount ----
  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: 'microphone' }).then((result) => {
      if (result.state === 'denied') {
        toast.error('🎙️ Microphone is BLOCKED!\nGo to browser settings → Allow microphone for this site.', { duration: 10000 });
      }
      loadMicDevices();
      result.onchange = () => {
        loadMicDevices();
      };
    }).catch(err => {
      console.error('[Permission] Could not query mic permission:', err);
    });
  }, [loadMicDevices]);

  useEffect(() => {
    if (!navigator.mediaDevices?.addEventListener) return;
    const handleDeviceChange = () => loadMicDevices();
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
  }, [loadMicDevices]);


  // ---- Timer ----
  useEffect(() => {
    if (status === 'initializing' || status === 'finished') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); endInterview(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // ---- TTS ----
  const speakText = useCallback((text, callback) => {
    if (!synthRef.current) { return; }
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Premium') || v.name.includes('Female')));
    if (preferred) {
      utterance.voice = preferred;
    }
    utterance.rate = 0.95;
    utterance.pitch = persona === 'strict' ? 0.8 : persona === 'friendly' ? 1.2 : 1.0;

    utterance.onstart = () => { setStatus('speaking'); };
    utterance.onend = () => {
      setStatus('idle');
      if (callback) callback();
    };
    utterance.onerror = (e) => {
      console.error('[TTS Error]', e);
      setStatus('idle');
      if (callback) callback();
    };

    console.log('[TTS] Speaking', text);
    setAiMessage(text);
    synthRef.current.speak(utterance);
  }, [persona]);

  // ---- startNextQuestion — uses ref to avoid stale closures ----
  const startNextQuestion = useCallback((sessionDataArg, speechPrefix = '') => {
    const idx = currentQuestionIndexRef.current;
    const questions = sessionDataArg?.questions;
    if (!questions || idx >= questions.length) {
      if (speechPrefix) {
        speakText(speechPrefix + " That concludes our interview.", () => endInterview());
      } else {
        endInterview();
      }
      return;
    }
    const q = questions[idx];
    // Clear ALL transcript buffers for this new question
    transcriptRef.current = '';
    accumulatedRef.current = '';
    sessionFinalsRef.current = '';
    setTranscript('');
    
    const textToSpeak = speechPrefix ? `${speechPrefix} ${q.question}` : q.question;
    speakText(textToSpeak, () => {
      // IMPORTANT: Wait 900ms after TTS ends before opening the microphone.
      // Chrome's audio subsystem needs time to switch from speaker (output)
      // to microphone (input). Opening mic immediately causes onaudioend
      // to fire instantly (stream instability) → no-speech → restart loop.
      setStatus('idle'); // show "ready" while waiting
      setTimeout(() => {
        startListening();
      }, 900);
    });
  }, [speakText, startListening]);


  // Keep ref in sync with state
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const startInterview = () => {
    let intro = 'Welcome to your mock interview. I will now ask you the first question.';
    if (persona === 'friendly') intro = "Hi! I'm really glad you're here. Let's jump into your mock interview — I'll be asking you some questions now.";
    if (persona === 'strict') intro = 'Technical assessment commencing. Answer each question clearly and concisely. First question:';
    speakText(intro, () => startNextQuestion(sessionData));
  };

  const evaluateAndRespond = async () => {
    const idx = currentQuestionIndexRef.current;
    const currentQuestion = sessionData?.questions[idx]?.question;
    // Read from transcriptRef — always current, never stale from React state
    const userAnswer = transcriptRef.current?.trim() || "I don't know the answer.";

    setStatus('thinking');
    console.log('[Evaluation] Submitting answer', userAnswer);

    try {
      const res = await axiosInstance.post(API_PATHS.AI.EVALUATE_ANSWER, {
        question: currentQuestion,
        userAnswer,
        persona,
      });

      const { spokenFeedback, evaluation } = res.data;
      const newIndex = idx + 1;
      setInterviewHistory(prev => {
        return [...prev, { question: currentQuestion, userAnswer, spokenFeedback, evaluation }];
      });
      setCurrentQuestionIndex(newIndex);
      currentQuestionIndexRef.current = newIndex;

      startNextQuestion(sessionData, spokenFeedback);

    } catch (err) {
      console.error('[Evaluation Error]', err);
      toast.error('Failed to evaluate answer, moving on...');
      const newIndex = idx + 1;
      setCurrentQuestionIndex(newIndex);
      currentQuestionIndexRef.current = newIndex;
      speakText("Let's continue to the next question.", () => startNextQuestion(sessionData));
    }
  };

  const toggleListening = () => {
    if (status === 'listening') {
      // Stop listening first
      stopListening();
      setStatus('thinking');
      // Wait 800ms for Chrome to deliver any pending onresult before we read transcript
      setTimeout(() => {
        evaluateAndRespond();
      }, 800);
    } else if (status === 'idle') {
      transcriptRef.current = ''; // clear before starting new answer
      accumulatedRef.current = '';
      setTranscript('');
      console.log('[STT] Manual start from idle');
      startListening();
    }
  };

  const endInterview = async () => {
    setStatus('finished');
    stopListening();
    stopMicStream();
    try {
      synthRef.current?.cancel();
    } catch (_) {}

    try {
      await axiosInstance.post(API_PATHS.SESSION.SAVE_ATTEMPT(sessionId), {
        history: interviewHistory,
        persona,
        duration,
      });
    } catch (err) {
      console.error('[Network Error] Could not save attempt:', err);
      toast.error('Could not save interview history.');
    }

    navigate(`/interview/${sessionId}/feedback`, {
      state: { interviewHistory, persona, duration },
    });
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const formatMicLabel = (device, index) => device.label || `Microphone ${index + 1}`;
  const micLevelPercent = Math.min(Math.round(micLevel * 100), 100);
  const isInterviewNotStarted = currentQuestionIndex === 0 && status === 'idle' && !transcript;

  const waveColor =
    status === 'listening' ? '#4ade80' :
    status === 'speaking' ? '#22d3ee' :
    status === 'thinking' ? '#a855f7' : '#4b5563';

  const ambientColor =
    status === 'listening' ? 'rgba(74,222,128,0.15)' :
    status === 'speaking' ? 'rgba(34,211,238,0.15)' :
    status === 'thinking' ? 'rgba(168,85,247,0.15)' :
    'rgba(59,130,246,0.10)';

  if (status === 'initializing') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Initializing Interview Engine...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000"
          style={{ backgroundColor: ambientColor }}
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 z-20 overflow-x-hidden">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
          <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-300 border border-white/10">
            {persona.charAt(0).toUpperCase() + persona.slice(1)} Persona
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-sm font-mono font-bold text-gray-300 border border-white/10 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status !== 'finished' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
            {formatTime(timeLeft)}
          </div>
          {/* Question progress */}
          {sessionData?.questions && (
            <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-sm font-semibold text-gray-400 border border-white/10">
              Q {Math.min(currentQuestionIndex + 1, sessionData.questions.length)} / {sessionData.questions.length}
            </div>
          )}
          <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-2 text-xs font-semibold text-gray-400 border border-white/10 flex items-center gap-2">
            <span className="text-gray-500">Input</span>
            <select
              value={selectedMicId}
              onChange={(e) => setSelectedMicId(e.target.value)}
              className="bg-transparent text-gray-200 text-xs outline-none max-w-[220px]"
              disabled={isMicLoading || micDevices.length === 0}
            >
              {micDevices.length === 0 ? (
                <option value="">No microphones</option>
              ) : (
                micDevices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {formatMicLabel(device, index)}
                  </option>
                ))
              )}
            </select>
            <button
              type="button"
              onClick={loadMicDevices}
              className="text-[10px] text-gray-500 hover:text-gray-200 transition"
              disabled={isMicLoading}
            >
              {isMicLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={() => setUseRawMic(prev => !prev)}
              className={`text-[10px] transition ${useRawMic ? 'text-green-400' : 'text-gray-500 hover:text-gray-200'}`}
            >
              Raw {useRawMic ? 'On' : 'Off'}
            </button>
            <select
              value={sttLanguage}
              onChange={(e) => setSttLanguage(e.target.value)}
              className="bg-transparent text-gray-200 text-xs outline-none"
            >
              <option value="en-US">en-US</option>
              <option value="en-IN">en-IN</option>
              <option value="en-GB">en-GB</option>
              <option value="en-AU">en-AU</option>
            </select>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-20 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${micLevelPercent}%`,
                    backgroundColor: micEnergyActive ? '#22c55e' : '#6b7280',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={endInterview}
          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-medium transition-all duration-300 border border-red-500/20 flex items-center gap-2 shrink-0 text-sm md:text-base"
        >
          <LuPhoneOff /> End Session
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-6 pt-24 pb-48">
        {/* Status label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`text-xs font-bold tracking-[0.25em] uppercase mb-8 ${
              status === 'listening' ? 'text-green-400' :
              status === 'speaking' ? 'text-cyan-400' :
              status === 'thinking' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            {status === 'idle' ? 'Ready' :
             status === 'listening' ? '● Listening' :
             status === 'speaking' ? '▶ Speaking' :
             status === 'thinking' ? '◌ Analyzing' :
             status === 'finished' ? 'Session Complete' : status}
          </motion.div>
        </AnimatePresence>

        {/* Robot face */}
        <RobotFace status={status} />

        {/* Transcript / Question text */}
        <div className="w-full max-w-2xl text-center mt-10 min-h-[100px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={status === 'speaking' ? `q-${currentQuestionIndex}` : `t-${transcript.slice(0, 20)}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              {status === 'speaking' ? (
                <p className="text-2xl font-semibold text-white leading-relaxed">
                  {aiMessage || sessionData?.questions[currentQuestionIndex]?.question}
                </p>
              ) : transcript ? (
                <p className="text-xl text-gray-200 leading-relaxed italic">"{transcript}"</p>
              ) : (
                <p className="text-lg text-gray-600 italic">
                  {status === 'listening' ? 'Speak your answer — I\'m listening...' :
                   status === 'thinking' ? 'Analyzing your response...' :
                   'Waiting for your response...'}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-6 pb-10 pt-20 bg-gradient-to-t from-black via-black/70 to-transparent">
        {/* Waveform */}
        <AudioWaveform isActive={status === 'listening' || status === 'speaking'} color={waveColor} />

        {/* Buttons */}
        <div className="flex items-center gap-6 mt-2">
          {isInterviewNotStarted ? (
            <button
              onClick={startInterview}
              className="bg-white text-black font-bold px-10 py-4 rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
            >
              Start Interview
            </button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleListening}
              disabled={status === 'speaking' || status === 'thinking' || status === 'finished'}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                status === 'listening'
                  ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
                  : 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105'
              } ${status === 'speaking' || status === 'thinking' || status === 'finished' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {status === 'listening'
                ? <LuSquare className="w-8 h-8 text-white" />
                : <LuMic className="w-8 h-8" />}
            </motion.button>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {status === 'listening' ? 'Press ■ when done answering' :
           status === 'idle' ? (isInterviewNotStarted ? 'Press mic or start interview' : 'Press mic to answer') : ''}
        </p>
      </div>
    </div>
  );
};

export default LiveInterview;

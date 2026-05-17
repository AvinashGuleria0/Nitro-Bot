import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LuTarget, LuMessageSquare, LuChevronLeft, LuZap, LuCircleAlert, LuVolume2 } from 'react-icons/lu';
import { motion } from 'framer-motion';

const FeedbackReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const history = location.state?.interviewHistory || [];
  const persona = location.state?.persona || 'standard';

  const { avgScore, avgConfidence } = useMemo(() => {
    if (history.length === 0) return { avgScore: 0, avgConfidence: 0 };
    let totalScore = 0;
    let totalConfidence = 0;
    history.forEach(h => {
      totalScore += h.evaluation?.score || 0;
      totalConfidence += h.evaluation?.confidenceScore || 0;
    });
    return {
      avgScore: Math.round(totalScore / history.length),
      avgConfidence: Math.round(totalConfidence / history.length)
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <LuCircleAlert className="text-gray-400 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Interview Data</h2>
        <p className="text-gray-500 mb-6">We couldn't find any feedback data for this session.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="container mx-auto px-6 max-w-5xl h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <LuChevronLeft className="text-xl text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Interview Feedback</h1>
          </div>
          <div className="flex gap-3">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100 capitalize">
              {persona} Persona
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl pt-10">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-full border-[6px] border-blue-100 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="34" cy="34" r="34" className="stroke-current text-blue-600" strokeWidth="6" fill="transparent" strokeDasharray="213" strokeDashoffset={213 - (213 * avgScore) / 10} />
              </svg>
              <span className="text-2xl font-black text-gray-900">{avgScore}<span className="text-sm text-gray-400">/10</span></span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Overall Performance</h3>
              <p className="text-gray-500 font-medium">Based on technical accuracy and delivery.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <LuTarget className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-end gap-2 mb-1">
                <h3 className="text-3xl font-black text-gray-900 leading-none">{avgConfidence}%</h3>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">Confidence Score</h3>
              <p className="text-gray-500 font-medium text-sm">Analyzed from your response delivery and sentiment.</p>
            </div>
          </motion.div>
        </div>

        {/* Detailed Q&A Breakdown */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <LuMessageSquare className="text-blue-600" />
          Detailed Evaluation
        </h2>

        <div className="space-y-8">
          {history.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }}
              key={idx} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Question Header */}
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Question {idx + 1}</span>
                    <h3 className="text-lg font-bold text-gray-900">{item.question}</h3>
                  </div>
                  <div className="flex-shrink-0 bg-white border border-gray-200 px-3 py-1 rounded-lg text-center shadow-sm">
                    <span className="block text-2xl font-black text-gray-900 leading-none">{item.evaluation?.score || 0}</span>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase mt-0.5">Score</span>
                  </div>
                </div>
              </div>

              {/* Answers & Feedback */}
              <div className="p-6 space-y-6">
                
                {/* User's Answer */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div> Your Answer
                    </h4>
                    <button 
                      onClick={() => {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(item.userAnswer);
                        window.speechSynthesis.speak(utterance);
                      }}
                      className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <LuVolume2 className="w-3.5 h-3.5" /> Playback
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 leading-relaxed border border-gray-100 italic">
                    "{item.userAnswer}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AI Feedback */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <LuZap className="text-yellow-500" /> AI Critique & Sentiment
                    </h4>
                    <div className="bg-yellow-50/50 rounded-2xl p-4 text-gray-800 leading-relaxed border border-yellow-100/50 h-full">
                      <p className="mb-3">{item.spokenFeedback}</p>
                      <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-yellow-200 text-xs font-semibold text-yellow-800 shadow-sm">
                        Sentiment: {item.evaluation?.sentiment || "Neutral"}
                      </div>
                    </div>
                  </div>

                  {/* Key Differences */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <LuCircleAlert className="text-red-500" /> Areas for Improvement
                    </h4>
                    <div className="bg-red-50/50 rounded-2xl p-4 text-gray-800 border border-red-100/50 h-full">
                      <ul className="space-y-2">
                        {item.evaluation?.keyDifferences?.map((diff, dIdx) => (
                          <li key={dIdx} className="flex gap-2 text-sm">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span className="leading-relaxed">{diff}</span>
                          </li>
                        )) || <span className="text-sm text-gray-500">Perfect answer! No major differences found.</span>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Industry Standard */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-xs">IS</div> 
                    Industry Standard Answer
                  </h4>
                  <div className="bg-blue-50/50 rounded-2xl p-5 text-gray-800 leading-relaxed border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                    <p className="relative z-10">{item.evaluation?.industryStandardAnswer || "N/A"}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackReport;

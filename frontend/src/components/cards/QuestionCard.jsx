import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 20);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="group bg-white/90 backdrop-blur-sm rounded-2xl mb-6 overflow-hidden shadow-lg hover:shadow-xl border border-slate-200/50 hover:border-slate-300/50 transition-all duration-500 hover:transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mt-0.5">
                <span className="text-sm font-bold text-white">Q</span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-base md:text-lg font-semibold text-slate-800 leading-relaxed cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                  onClick={toggleExpand}
                >
                  {question}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 md:opacity-0 md:group-hover:opacity-100 translate-x-2 md:group-hover:translate-x-0"
                }`}
              >
                <button
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    isPinned
                      ? "text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100"
                      : "text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100"
                  }`}
                  onClick={onTogglePin}
                  title={isPinned ? "Unpin question" : "Pin question"}
                >
                  {isPinned ? (
                    <LuPinOff className="text-sm" />
                  ) : (
                    <LuPin className="text-sm" />
                  )}
                  <span className="hidden sm:block">
                    {isPinned ? "Pinned" : "Pin"}
                  </span>
                </button>

                <button
                  className="flex items-center gap-2 text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-2 rounded-full border border-indigo-200 hover:bg-indigo-100 hover:scale-105 transition-all duration-300"
                  onClick={() => {
                    setIsExpanded(true);
                    onLearnMore();
                  }}
                  title="Get AI insights"
                >
                  <LuSparkles className="text-sm" />
                  <span className="hidden sm:block">Learn More</span>
                </button>
              </div>

              <button
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all duration-300"
                onClick={toggleExpand}
                title={isExpanded ? "Collapse answer" : "Expand answer"}
              >
                <LuChevronDown
                  size={20}
                  className={`transform transition-transform duration-500 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden transition-all duration-500 ease-out"
            style={{ maxHeight: `${height}px` }}
          >
            <div
              ref={contentRef}
              className="mt-6 pt-6 border-t border-slate-100"
            >
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    AI Response
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed">
                  <AIResponsePreview content={answer} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-pulse"></div>
        )}
      </div>
    </>
  );
};

export default QuestionCard;

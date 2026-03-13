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
      <div className="group bg-white mb-6 sketch-border sketch-shadow-sm hover:sketch-shadow transition-all duration-300">
        <div className="p-6">
          <div className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-accent-blue)] sketch-border flex items-center justify-center mt-0.5 -rotate-3">
                <span className="text-sm font-black text-black">Q</span>
              </div>
              <div className="flex-1">
                <h3
                  className="text-base md:text-xl font-black text-black leading-relaxed cursor-pointer hover:bg-[var(--color-accent-yellow)] transition-colors duration-300 p-1"
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
                  className={`flex items-center gap-2 text-xs font-black px-3 py-2 sketch-border transition-all duration-300 hover:-translate-y-1 ${
                    isPinned
                      ? "text-black bg-[var(--color-accent-pink)] shadow-[2px_2px_0px_0px_#000]"
                      : "text-black bg-white hover:bg-[var(--color-accent-yellow)]"
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
                  className="flex items-center gap-2 text-xs font-black text-black bg-[var(--color-accent-green)] px-3 py-2 sketch-border hover:-translate-y-1 transition-all duration-300 shadow-[2px_2px_0px_0px_#000]"
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
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-black bg-white sketch-border hover:bg-[var(--color-accent-blue)] transition-all duration-300 ml-2"
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
              className="mt-6 pt-6 border-t-2 border-dashed border-black"
            >
              <div className="bg-[var(--color-bg)] sketch-border p-6 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white sketch-border flex items-center justify-center -rotate-2">
                    <span className="text-xs font-black text-black">A</span>
                  </div>
                  <span className="text-sm font-black text-black bg-[var(--color-accent-yellow)] px-2 border-2 border-black">
                    AI Response
                  </span>
                </div>
                <div className="text-slate-800 font-bold leading-relaxed">
                  <AIResponsePreview content={answer} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="h-2 bg-[var(--color-accent-pink)] border-t-4 border-black"></div>
        )}
      </div>
    </>
  );
};

export default QuestionCard;

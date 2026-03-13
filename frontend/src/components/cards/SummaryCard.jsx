import React from "react";
import { LuTrash2, LuBriefcase, LuClock, LuMessageSquare, LuCalendarDays } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const bgColors = ["bg-[var(--color-accent-pink)]", "bg-[var(--color-accent-blue)]", "bg-[var(--color-accent-yellow)]", "bg-[var(--color-accent-green)]"];

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  // Use index from mapped elements potentially or default random-ish for sketch
  const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className="group cursor-pointer block" onClick={onSelect}>
      <div className="bg-white sketch-border sketch-shadow-sm hover:sketch-shadow transition-all duration-300 hover:-translate-y-1">
        <div
          className={`relative p-6 text-black border-b-4 border-black ${colors?.sketchBg || randomBg}`}
        >
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-white sketch-border flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-xl font-black text-black">
                  {getInitials(role)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-black mb-1 truncate bg-white inline-block px-2 sketch-border shadow-[2px_2px_0px_0px_#000]">
                  {role}
                </h2>
                <p className="text-sm text-slate-800 font-bold line-clamp-2 leading-relaxed bg-white/80 p-1 border-l-2 border-black mt-2">
                  {topicsToFocus || "No specific topics defined"}
                </p>
              </div>
            </div>

            <button
              className="flex items-center justify-center w-10 h-10 bg-white hover:bg-black text-black hover:text-white sketch-border transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete session"
            >
              <LuTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-[var(--color-bg)] border-2 border-black p-3">
              <div className="w-8 h-8 bg-[var(--color-accent-blue)] border-2 border-black flex items-center justify-center">
                <LuBriefcase className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-bold">Experience</p>
                <p className="text-sm font-black text-black">
                  {experience} {experience === 1 ? "Year" : "Years"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[var(--color-bg)] border-2 border-black p-3">
              <div className="w-8 h-8 bg-[var(--color-accent-pink)] border-2 border-black flex items-center justify-center">
                <LuMessageSquare className="w-4 h-4 text-black" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-bold">Questions</p>
                <p className="text-sm font-black text-black">
                  {questions} Q&A
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 w-fit px-2 py-1 sketch-border">
            <LuCalendarDays className="w-3 h-3 text-black" />
            <span>Updated {lastUpdated}</span>
          </div>

          {description && (
            <div className="pt-4 border-t-2 border-dashed border-slate-300">
              <p className="text-sm font-bold text-slate-700 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-xs font-black text-black">
              <div className="w-3 h-3 bg-[var(--color-accent-green)] sketch-border animate-pulse"></div>
              <span>Ready to practice</span>
            </div>
            <div className="w-8 h-8 bg-white sketch-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[2px_2px_0px_0px_#000]">
              <div className="w-2 h-2 bg-black rounded-full transform group-hover:translate-x-1 transition-transform duration-300"></div>
            </div>
          </div>
        </div>

        <div className={`h-2 border-t-4 border-black ${colors?.sketchBg || randomBg}`}></div>
      </div>
    </div>
  );
};

export default SummaryCard;
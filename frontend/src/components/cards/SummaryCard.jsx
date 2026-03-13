import React from "react";
import { LuTrash2, LuBriefcase, LuClock, LuMessageSquare, LuCalendarDays } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

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
  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      <div className="sketch-border sketch-shadow bg-white overflow-hidden transition-all duration-300 hover:translate-y-1 hover:shadow-none min-h-[220px] flex flex-col justify-between">
        <div
          className="relative p-5 border-b-4 border-black"
          style={{
            background: colors.bgcolor || 'var(--color-accent-blue)',
          }}
        >
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-white sketch-border flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <span className="text-xl font-black text-black">
                  {getInitials(role)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-black mb-1 truncate leading-tight">
                  {role}
                </h2>
                <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
                  {topicsToFocus || "No specific topics defined"}
                </p>
              </div>
            </div>

            <button
              className="flex items-center justify-center w-10 h-10 bg-white hover:bg-[var(--color-accent-pink)] sketch-border shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete session"
            >
              <LuTrash2 className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white sketch-border px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
            <p className="text-xs font-bold text-black border-r-2 border-black pr-2">Experience</p>
            <p className="text-sm font-black text-black">
              {experience} {experience === 1 ? "Year" : "Years"}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white sketch-border px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
            <p className="text-xs font-bold text-black border-r-2 border-black pr-2">Questions</p>
            <p className="text-sm font-black text-black">
              {questions} Q&A
            </p>
          </div>
          
          <div className="flex w-full items-center gap-2 bg-white sketch-border px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] mt-2">
            <p className="text-xs font-bold text-black border-r-2 border-black pr-2">Last Updated</p>
            <p className="text-sm font-black text-black">
              {lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
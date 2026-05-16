import React from "react";
import { LuTrash2, LuClock, LuMessageSquare, LuBriefcase } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
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
    <div 
      className="group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
      onClick={onSelect}
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner flex-shrink-0">
              <span className="text-lg font-bold">
                {getInitials(role)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                {role}
              </h2>
              <p className="text-sm font-medium text-gray-500 line-clamp-2 leading-relaxed">
                {topicsToFocus || "General preparation"}
              </p>
            </div>
          </div>

          <button
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete session"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md">
            <LuBriefcase className="w-3.5 h-3.5" />
            <span>{experience} {experience === 1 ? "Year" : "Years"}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-md">
            <LuMessageSquare className="w-3.5 h-3.5" />
            <span>{questions} Q&A</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500 font-medium">
        <LuClock className="w-3.5 h-3.5" />
        <span>Updated {lastUpdated}</span>
      </div>
    </div>
  );
};

export default SummaryCard;
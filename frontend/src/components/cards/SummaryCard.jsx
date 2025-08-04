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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-slate-200/50 hover:border-slate-300/50 transition-all duration-500 hover:transform hover:-translate-y-2">
        {/* Header Section with Gradient Background */}
        <div
          className="relative p-6 text-white"
          style={{
            background: colors.bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          {/* Subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Role Avatar */}
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <span className="text-xl font-bold text-white">
                  {getInitials(role)}
                </span>
              </div>
              
              {/* Role Information */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white mb-1 truncate">
                  {role}
                </h2>
                <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
                  {topicsToFocus || "No specific topics defined"}
                </p>
              </div>
            </div>

            {/* Delete Button */}
            <button
              className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-red-500/90 backdrop-blur-sm rounded-full border border-white/30 hover:border-red-400 transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete session"
            >
              <LuTrash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <LuBriefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Experience</p>
                <p className="text-sm font-semibold text-slate-800">
                  {experience} {experience === 1 ? "Year" : "Years"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <LuMessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Questions</p>
                <p className="text-sm font-semibold text-slate-800">
                  {questions} Q&A
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LuCalendarDays className="w-3 h-3" />
            <span>Updated {lastUpdated}</span>
          </div>

          {/* Description */}
          {description && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {description}
              </p>
            </div>
          )}

          {/* Action Indicator */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready to practice</span>
            </div>
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-slate-400 rounded-full transform group-hover:translate-x-0.5 transition-transform duration-300"></div>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div 
          className="h-1 opacity-60"
          style={{
            background: colors.bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        ></div>
      </div>
    </div>
  );
};

export default SummaryCard;
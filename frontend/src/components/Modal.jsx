import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60 transition-opacity p-4">
      <div
        className={`relative flex flex-col bg-white sketch-border sketch-shadow-lg overflow-hidden w-full max-w-lg`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b-2 border-black bg-[var(--color-accent-yellow)]">
            <h3 className="text-xl font-black text-black">{title}</h3>
          </div>
        )}
        <button
          type="button"
          className="text-black bg-white sketch-border w-8 h-8 flex justify-center items-center absolute top-4 right-4 cursor-pointer hover:bg-[var(--color-accent-pink)] hover:translate-y-px hover:translate-x-px transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-none z-10"
          onClick={onClose}
        >
          <svg 
            className="h-5 w-5"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 L14 14 M14 2 L2 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="flex overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

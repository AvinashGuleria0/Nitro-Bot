import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40 backdrop-blur-sm">
      <div
        className={`relative flex flex-col bg-white sketch-border sketch-shadow-lg overflow-hidden m-4`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b-4 border-black bg-[var(--color-accent-yellow)]">
            <h3 className="md:text-xl font-black text-black">{title}</h3>
          </div>
        )}
        <button
          type="button"
          className=" text-black bg-white hover:bg-[var(--color-accent-pink)] sketch-border text-sm w-8 h-8 flex justify-center items-center absolute top-4 right-4 cursor-pointer transition-colors shadow-[2px_2px_0px_0px_#000] z-10"
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

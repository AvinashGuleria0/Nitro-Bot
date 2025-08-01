import React from "react";

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/40">
      <div
        className={`absolute flex flex-col bg-white shadow-lg rounded-lg overflow-hidden`}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="md:text-lg font-medium text-gray-900">{title}</h3>
          </div>
        )}
        <button
          type="button"
          className=" text-gray-400 bg-transparent hover:bg-orange-100 hover:text-gray-900 rounded-lg text-sm w-6 h-6 flex justify-center items-center absolute top-4 right-4 cursor-pointer"
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

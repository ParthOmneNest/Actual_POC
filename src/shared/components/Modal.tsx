import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    // Backdrop with Blur
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      
      {/* Invisible overlay to handle click-outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Modal Content Box */}
      <div className="relative bg-white rounded-xl shadow-xl z-10 w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header  */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEDEE]">
          {title ? (
            <h2 className="text-lg font-bold text-[#2A2A2B]">{title}</h2>
          ) : (
            <div />
          )}
          {/* <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button> */}
          </div>
        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>

    </div>
  );
};

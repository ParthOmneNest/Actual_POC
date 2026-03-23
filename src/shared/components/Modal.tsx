import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  // Mount logic to avoid SSR/hydration issues and lock body scroll when open
  useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup to ensure body unlocks if modal unmounts while open
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    // Backdrop with Blur
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="presentation" // ARIA: denotes a pure presentational overlay
    >
      
      {/* Invisible overlay to handle click-outside to close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
        aria-hidden="true" // ARIA: hides this invisible hack from screen readers
      ></div>
      
      {/* Modal Content Box */}
      <div 
        role="dialog" // ARIA: Identifies this box as a modal dialog
        aria-modal="true" // ARIA: informs screen readers no interaction outside is possible
        aria-labelledby={title ? "modal-title" : undefined}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header (Always renders close button, title is optional) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEDEE]">
          {title ? (
            <h2 id="modal-title" className="text-lg font-bold text-[#2A2A2B]">{title}</h2>
          ) : (
            <div />
          )}
          <button 
              onClick={onClose}
              aria-label={title ? `Close ${title} modal` : "Close modal"} // ARIA: Descriptive label for the iconic button
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>

    </div>
  );

  // React 18 createPortal pushes the modal outside of the root div 
  // directly into the document body to guarantee zero z-index or overflow-hidden clipping!
  return createPortal(modalContent, document.body);
};

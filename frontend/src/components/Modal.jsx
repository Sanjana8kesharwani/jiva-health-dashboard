import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 z-10 border border-gray-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body (scrollable) */}
        <div className="px-6 py-5 overflow-y-auto flex-1 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

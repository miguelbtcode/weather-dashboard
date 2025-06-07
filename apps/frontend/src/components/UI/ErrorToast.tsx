import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className="glass bg-red-500/20 border-red-400/50 rounded-xl p-4 border">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-white">{message}</span>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white ml-2 p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Close error message"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { FC, useEffect, useState } from 'react';
import type { ToastMessage } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const toastConfig = {
  success: {
    bg: 'bg-green-500',
    icon: <CheckCircleIcon className="w-6 h-6 text-white" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <XCircleIcon className="w-6 h-6 text-white" />,
  },
  info: {
    bg: 'bg-blue-500',
    icon: <InformationCircleIcon className="w-6 h-6 text-white" />,
  },
};

const Toast: FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Animate in
    const timer = setTimeout(() => {
      setVisible(false); // Start fade out
    }, 4500);
    return () => clearTimeout(timer);
  }, []);
  
  // Auto-close after animation
  useEffect(() => {
      if(!visible) {
          const closeTimer = setTimeout(() => onClose(), 500);
          return () => clearTimeout(closeTimer);
      }
  }, [visible, onClose]);

  const config = toastConfig[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`relative flex items-center p-4 text-white rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform ${config.bg} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-white rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Dismiss"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;

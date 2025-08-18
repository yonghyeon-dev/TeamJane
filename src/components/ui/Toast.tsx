'use client';

import React, { useState, useEffect } from 'react';
import { XIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // 애니메이션을 위해 약간의 지연 후 표시
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // 자동 제거 타이머
    const removeTimer = setTimeout(() => {
      handleRemove();
    }, toast.duration || 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.duration]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className={cn(iconClass, "text-green-600")} />;
      case 'error':
        return <XCircleIcon className={cn(iconClass, "text-red-600")} />;
      case 'warning':
        return <AlertCircleIcon className={cn(iconClass, "text-yellow-600")} />;
      case 'info':
        return <InfoIcon className={cn(iconClass, "text-blue-600")} />;
      default:
        return <InfoIcon className={cn(iconClass, "text-gray-600")} />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-sm mx-auto p-4 border rounded-lg shadow-lg transition-all duration-300 ease-in-out",
        getBackgroundColor(),
        isVisible && !isRemoving ? "transform translate-x-0 opacity-100" : "transform translate-x-full opacity-0",
        isRemoving && "transform translate-x-full opacity-0"
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-600">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium underline hover:no-underline focus:outline-none"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleRemove}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
          >
            <span className="sr-only">닫기</span>
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2"
      aria-live="assertive"
      aria-label="알림"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default Toast;
'use client';

import { useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '@/components/ui/Toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    message?: string,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration: options?.duration || 5000,
      action: options?.action,
    };

    setToasts(prev => [...prev, newToast]);
    
    // ID 반환 (수동으로 제거할 때 사용 가능)
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 편의 메서드들
  const success = useCallback((title: string, message?: string, options?: any) => {
    return addToast('success', title, message, options);
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: any) => {
    return addToast('error', title, message, options);
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: any) => {
    return addToast('warning', title, message, options);
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: any) => {
    return addToast('info', title, message, options);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};
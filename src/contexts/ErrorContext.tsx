'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface ErrorContextType {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  handleApiError: (error: any, customMessage?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { toasts, success, error, warning, info, removeToast } = useToast();

  const showSuccess = (title: string, message?: string) => {
    success(title, message);
  };

  const showError = (title: string, message?: string) => {
    error(title, message, { duration: 7000 }); // 에러는 조금 더 오래 표시
  };

  const showWarning = (title: string, message?: string) => {
    warning(title, message);
  };

  const showInfo = (title: string, message?: string) => {
    info(title, message);
  };

  const handleApiError = (apiError: any, customMessage?: string) => {
    let title = customMessage || '오류가 발생했습니다';
    let message = '';

    // API 에러 형식에 따른 메시지 추출
    if (apiError?.response?.data?.error) {
      message = apiError.response.data.error;
    } else if (apiError?.response?.data?.message) {
      message = apiError.response.data.message;
    } else if (apiError?.message) {
      message = apiError.message;
    } else if (typeof apiError === 'string') {
      message = apiError;
    } else {
      message = '알 수 없는 오류가 발생했습니다.';
    }

    // HTTP 상태 코드별 메시지
    if (apiError?.response?.status) {
      switch (apiError.response.status) {
        case 400:
          title = '잘못된 요청';
          break;
        case 401:
          title = '인증이 필요합니다';
          message = '로그인이 필요하거나 세션이 만료되었습니다.';
          break;
        case 403:
          title = '접근 권한이 없습니다';
          break;
        case 404:
          title = '요청한 리소스를 찾을 수 없습니다';
          break;
        case 422:
          title = '입력 데이터를 확인해주세요';
          break;
        case 429:
          title = '요청이 너무 많습니다';
          message = '잠시 후 다시 시도해주세요.';
          break;
        case 500:
          title = '서버 오류';
          message = '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        case 503:
          title = '서비스 이용 불가';
          message = '서비스가 일시적으로 이용할 수 없습니다.';
          break;
        default:
          title = customMessage || '오류가 발생했습니다';
      }
    }

    // 네트워크 오류 처리
    if (apiError?.code === 'NETWORK_ERROR' || apiError?.name === 'NetworkError') {
      title = '네트워크 오류';
      message = '인터넷 연결을 확인해주세요.';
    }

    error(title, message, { 
      duration: 7000,
      action: {
        label: '다시 시도',
        onClick: () => {
          // 필요시 재시도 로직을 여기에 추가
          console.log('재시도 버튼 클릭됨');
        }
      }
    });
  };

  const value: ErrorContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
// ERP 시스템을 위한 확장된 테마 설정
import { THEME_CONSTANTS } from './constants'

// 화이트 테마 + Custom 1 색상 팔레트 적용
export const ERP_THEME_CONFIG = {
  // 기본 테마 설정
  currentTheme: "white" as const,
  selectedPaletteId: "custom1" as const,
  
  // Custom 1 색상 (청록색 계열)
  currentColors: {
    primary: "#4ECDC4",    // 청록색
    secondary: "#45B7D1",  // 하늘색  
    default: "#1A535C"     // 진한 청록색
  },
  
  // ERP 상태별 색상
  status: {
    // 프로젝트 상태
    pending: "#F59E0B",      // 대기 중 (주황)
    inProgress: "#4ECDC4",   // 진행 중 (청록 - primary)
    feedback: "#8B5CF6",     // 피드백 (보라)
    completed: "#10B981",    // 완료 (초록)
    cancelled: "#EF4444",    // 취소됨 (빨강)
    onHold: "#6B7280",       // 보류 (회색)
    
    // 문서 상태
    draft: "#6B7280",        // 초안 (회색)
    sent: "#3B82F6",         // 발송됨 (파랑)
    viewed: "#F59E0B",       // 열람됨 (주황)
    signed: "#10B981",       // 서명됨 (초록)
    
    // 청구서 상태
    issued: "#3B82F6",       // 발행됨 (파랑)
    paid: "#10B981",         // 입금완료 (초록)
    overdue: "#DC2626",      // 연체 (진한 빨강)
  },
  
  // 재무 관련 색상
  finance: {
    income: "#059669",       // 수입 (진한 초록)
    expense: "#DC2626",      // 지출 (진한 빨강)
    profit: "#0D9488",       // 수익 (청록)
    loss: "#B91C1C",         // 손실 (진한 빨강)
    tax: "#7C3AED",          // 세금 (보라)
  },
  
  // 우선순위 색상
  priority: {
    low: "#6B7280",          // 낮음 (회색)
    medium: "#F59E0B",       // 보통 (주황)
    high: "#EF4444",         // 높음 (빨강)
    urgent: "#DC2626",       // 긴급 (진한 빨강)
  },
  
  // 클라이언트 관련 색상
  client: {
    active: "#10B981",       // 활성 (초록)
    inactive: "#6B7280",     // 비활성 (회색)
    archived: "#374151",     // 보관됨 (진한 회색)
  }
}

// CSS 변수로 변환하는 함수
export function generateERPCSSVariables(theme = ERP_THEME_CONFIG) {
  return {
    // 기본 색상 (Custom 1 팔레트)
    '--color-primary': theme.currentColors.primary,
    '--color-secondary': theme.currentColors.secondary,
    '--color-default': theme.currentColors.default,
    
    // 상태 색상
    '--color-status-pending': theme.status.pending,
    '--color-status-in-progress': theme.status.inProgress,
    '--color-status-feedback': theme.status.feedback,
    '--color-status-completed': theme.status.completed,
    '--color-status-cancelled': theme.status.cancelled,
    '--color-status-on-hold': theme.status.onHold,
    
    '--color-status-draft': theme.status.draft,
    '--color-status-sent': theme.status.sent,
    '--color-status-viewed': theme.status.viewed,
    '--color-status-signed': theme.status.signed,
    
    '--color-status-issued': theme.status.issued,
    '--color-status-paid': theme.status.paid,
    '--color-status-overdue': theme.status.overdue,
    
    // 재무 색상
    '--color-finance-income': theme.finance.income,
    '--color-finance-expense': theme.finance.expense,
    '--color-finance-profit': theme.finance.profit,
    '--color-finance-loss': theme.finance.loss,
    '--color-finance-tax': theme.finance.tax,
    
    // 우선순위 색상
    '--color-priority-low': theme.priority.low,
    '--color-priority-medium': theme.priority.medium,
    '--color-priority-high': theme.priority.high,
    '--color-priority-urgent': theme.priority.urgent,
    
    // 클라이언트 색상
    '--color-client-active': theme.client.active,
    '--color-client-inactive': theme.client.inactive,
    '--color-client-archived': theme.client.archived,
  }
}

// 상태별 스타일 헬퍼 함수들
export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    // 프로젝트 상태
    'PENDING': ERP_THEME_CONFIG.status.pending,
    'IN_PROGRESS': ERP_THEME_CONFIG.status.inProgress,
    'FEEDBACK': ERP_THEME_CONFIG.status.feedback,
    'COMPLETED': ERP_THEME_CONFIG.status.completed,
    'CANCELLED': ERP_THEME_CONFIG.status.cancelled,
    'ON_HOLD': ERP_THEME_CONFIG.status.onHold,
    
    // 문서 상태
    'DRAFT': ERP_THEME_CONFIG.status.draft,
    'SENT': ERP_THEME_CONFIG.status.sent,
    'VIEWED': ERP_THEME_CONFIG.status.viewed,
    'SIGNED': ERP_THEME_CONFIG.status.signed,
    
    // 청구서 상태
    'ISSUED': ERP_THEME_CONFIG.status.issued,
    'PAID': ERP_THEME_CONFIG.status.paid,
    'OVERDUE': ERP_THEME_CONFIG.status.overdue,
  }
  
  return statusMap[status] || ERP_THEME_CONFIG.currentColors.default
}

export const getPriorityColor = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    'LOW': ERP_THEME_CONFIG.priority.low,
    'MEDIUM': ERP_THEME_CONFIG.priority.medium,
    'HIGH': ERP_THEME_CONFIG.priority.high,
    'URGENT': ERP_THEME_CONFIG.priority.urgent,
  }
  
  return priorityMap[priority] || ERP_THEME_CONFIG.priority.medium
}

export const getFinanceColor = (type: string): string => {
  const financeMap: Record<string, string> = {
    'INCOME': ERP_THEME_CONFIG.finance.income,
    'EXPENSE': ERP_THEME_CONFIG.finance.expense,
    'PROFIT': ERP_THEME_CONFIG.finance.profit,
    'LOSS': ERP_THEME_CONFIG.finance.loss,
    'TAX': ERP_THEME_CONFIG.finance.tax,
  }
  
  return financeMap[type] || ERP_THEME_CONFIG.currentColors.default
}

// 상태별 배지 스타일
export const getStatusBadgeClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    // 프로젝트 상태 (대소문자 모두 지원)
    'PENDING': "bg-orange-100 text-orange-800",
    'pending': "bg-orange-100 text-orange-800",
    'planning': "bg-gray-100 text-gray-800",
    'IN_PROGRESS': "bg-teal-100 text-teal-800",
    'in-progress': "bg-blue-100 text-blue-800",
    'FEEDBACK': "bg-purple-100 text-purple-800",
    'feedback': "bg-purple-100 text-purple-800", 
    'review': "bg-yellow-100 text-yellow-800",
    'COMPLETED': "bg-green-100 text-green-800",
    'completed': "bg-green-100 text-green-800",
    'CANCELLED': "bg-red-100 text-red-800",
    'cancelled': "bg-red-100 text-red-800",
    'ON_HOLD': "bg-gray-100 text-gray-800",
    'on-hold': "bg-gray-100 text-gray-800",
    
    // 문서 상태
    'DRAFT': "bg-gray-100 text-gray-800",
    'draft': "bg-gray-100 text-gray-800",
    'SENT': "bg-blue-100 text-blue-800",
    'sent': "bg-blue-100 text-blue-800",
    'VIEWED': "bg-orange-100 text-orange-800",
    'viewed': "bg-orange-100 text-orange-800",
    'approved': "bg-yellow-100 text-yellow-800",
    'SIGNED': "bg-green-100 text-green-800",
    'signed': "bg-green-100 text-green-800",
    
    // 청구서 상태
    'ISSUED': "bg-blue-100 text-blue-800",
    'issued': "bg-blue-100 text-blue-800",
    'PAID': "bg-green-100 text-green-800",
    'paid': "bg-green-100 text-green-800",
    'OVERDUE': "bg-red-100 text-red-800",
    'overdue': "bg-red-100 text-red-800",
    
    // 클라이언트 상태
    'ACTIVE': "bg-green-100 text-green-800",
    'active': "bg-green-100 text-green-800",
    'INACTIVE': "bg-gray-100 text-gray-800",
    'inactive': "bg-gray-100 text-gray-800",
    'prospect': "bg-blue-100 text-blue-800",
    'ARCHIVED': "bg-gray-100 text-gray-600",
    'archived': "bg-gray-100 text-gray-600",
    
    // 우선순위
    'LOW': "bg-gray-100 text-gray-800",
    'low': "bg-gray-100 text-gray-800",
    'MEDIUM': "bg-orange-100 text-orange-800",
    'medium': "bg-orange-100 text-orange-800",
    'HIGH': "bg-red-100 text-red-800",
    'high': "bg-red-100 text-red-800",
    'URGENT': "bg-red-200 text-red-900",
    'urgent': "bg-red-200 text-red-900",
  }
  
  return statusClasses[status] || "bg-gray-100 text-gray-800"
}

// 통합된 ERP 테마 객체
export const ERP_THEME = {
  ...THEME_CONSTANTS,
  colors: {
    ...THEME_CONSTANTS.colors,
    ...ERP_THEME_CONFIG
  },
  helpers: {
    getStatusColor,
    getPriorityColor,
    getFinanceColor,
    getStatusBadgeClass,
    generateERPCSSVariables
  }
}
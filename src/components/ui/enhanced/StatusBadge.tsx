"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/theme/erp-theme'

interface StatusBadgeProps {
  status: string
  type?: 'project' | 'document' | 'invoice' | 'client' | 'priority'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'solid'
  className?: string
  children?: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'project',
  size = 'md',
  variant = 'default',
  className,
  children
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  const baseClass = `inline-flex items-center rounded-full font-medium`
  const statusClass = getStatusBadgeClass(status)
  const sizeClass = sizeClasses[size]

  // 변형에 따른 스타일 조정
  let variantClass = ''
  if (variant === 'outline') {
    variantClass = 'border bg-transparent'
  } else if (variant === 'solid') {
    variantClass = 'border-0'
  }

  return (
    <span 
      className={cn(
        baseClass,
        statusClass,
        sizeClass,
        variantClass,
        className
      )}
    >
      {children || getStatusLabel(status)}
    </span>
  )
}

// 상태 코드를 한국어 라벨로 변환
function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    // 프로젝트 상태 (소문자도 지원)
    'PENDING': '진행 전',
    'pending': '진행 전', 
    'planning': '기획 중',
    'IN_PROGRESS': '진행 중',
    'in-progress': '진행 중',
    'FEEDBACK': '피드백',
    'feedback': '피드백',
    'review': '검토 중',
    'COMPLETED': '완료',
    'completed': '완료',
    'CANCELLED': '취소됨',
    'cancelled': '취소됨',
    'ON_HOLD': '보류',
    'on-hold': '보류',
    
    // 문서 상태
    'DRAFT': '임시저장',
    'draft': '임시저장',
    'SENT': '발송됨',
    'sent': '발송됨',
    'VIEWED': '열람됨',
    'viewed': '열람됨',
    'approved': '승인됨',
    'SIGNED': '서명됨',
    'signed': '서명됨',
    
    // 청구서 상태
    'ISSUED': '발행됨',
    'issued': '발행됨',
    'PAID': '결제완료',
    'paid': '결제완료',
    'OVERDUE': '연체',
    'overdue': '연체',
    
    // 클라이언트 상태
    'ACTIVE': '활성',
    'active': '활성',
    'INACTIVE': '비활성',
    'inactive': '비활성',
    'prospect': '잠재고객',
    'ARCHIVED': '보관됨',
    'archived': '보관됨',
    
    // 우선순위
    'LOW': '낮음',
    'low': '낮음',
    'MEDIUM': '보통',
    'medium': '보통',
    'HIGH': '높음',
    'high': '높음',
    'URGENT': '긴급',
    'urgent': '긴급',
  }
  
  return statusLabels[status] || status
}

export default StatusBadge
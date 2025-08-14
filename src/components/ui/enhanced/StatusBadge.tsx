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
    // 프로젝트 상태
    'PENDING': '진행 전',
    'IN_PROGRESS': '진행 중',
    'FEEDBACK': '피드백',
    'COMPLETED': '완료',
    'CANCELLED': '취소됨',
    'ON_HOLD': '보류',
    
    // 문서 상태
    'DRAFT': '초안',
    'SENT': '발송됨',
    'VIEWED': '열람됨',
    'SIGNED': '서명됨',
    
    // 청구서 상태
    'ISSUED': '발행됨',
    'PAID': '입금완료',
    'OVERDUE': '연체',
    
    // 클라이언트 상태
    'ACTIVE': '활성',
    'INACTIVE': '비활성',
    'ARCHIVED': '보관됨',
    
    // 우선순위
    'LOW': '낮음',
    'MEDIUM': '보통',
    'HIGH': '높음',
    'URGENT': '긴급',
  }
  
  return statusLabels[status] || status
}

export default StatusBadge
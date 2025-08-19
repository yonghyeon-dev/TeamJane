'use client'

import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Input from './Input'
import Button from './Button'
import { isHoliday, getHoliday, isWeekend, formatDate } from '@/lib/utils/holidays'
import { cn } from '@/lib/utils'

interface DateInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  onBlur?: () => void
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(({
  value = '',
  onChange,
  placeholder = 'YYYY-MM-DD',
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  onBlur
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  // 선택된 날짜
  const selectedDate = value ? new Date(value) : null

  // 외부 클릭 감지 - 메모리 누수 방지 개선
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside, { passive: true })
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date) => {
    const dateStr = formatDate(date)
    onChange?.(dateStr)
    setIsOpen(false)
  }

  // 입력 필드 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  // 블러 핸들러
  const handleBlur = () => {
    onBlur?.()
  }

  // 월 변경
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  // 달력 생성
  const generateCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // 첫 번째 주의 시작일 (일요일)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    // 달력 날짜들 생성
    const calendar = []
    const currentDate = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      calendar.push(weekDays)
      
      // 마지막 주에 다음 달 날짜가 없으면 중단
      if (weekDays.every(date => date.getMonth() !== month) && week > 3) {
        break
      }
    }
    
    return calendar
  }

  // 날짜 셀 렌더링
  const renderDateCell = (date: Date) => {
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
    const isSelected = selectedDate && 
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    const isToday = new Date().toDateString() === date.toDateString()
    const holiday = getHoliday(date)
    const isWeekendDay = isWeekend(date)

    return (
      <button
        key={date.toISOString()}
        onClick={() => handleDateChange(date)}
        disabled={!isCurrentMonth}
        className={cn(
          'w-8 h-8 text-sm rounded-md transition-colors relative',
          'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
          {
            'text-gray-400': !isCurrentMonth,
            'bg-blue-500 text-white hover:bg-blue-600': isSelected,
            'bg-blue-100 text-blue-600': isToday && !isSelected,
            'text-red-600 font-medium': (holiday || isWeekendDay) && isCurrentMonth && !isSelected,
            'font-semibold': isCurrentMonth,
          }
        )}
        title={holiday ? holiday.name : undefined}
      >
        {date.getDate()}
        {holiday && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
        )}
      </button>
    )
  }

  const calendar = generateCalendar()

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={ref}
          type="date"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn('pr-10', className)}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => changeMonth('prev')}
              className="p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-semibold text-gray-900">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => changeMonth('next')}
              className="p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div
                key={day}
                className={cn(
                  'text-xs font-medium text-center p-2',
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 */}
          <div className="space-y-1">
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map(renderDateCell)}
              </div>
            ))}
          </div>

          {/* 공휴일 범례 */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>공휴일</span>
              </div>
              <div className="text-xs text-gray-500">
                날짜를 선택하세요
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
)

DateInput.displayName = 'DateInput'

export default DateInput
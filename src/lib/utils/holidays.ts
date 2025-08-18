// 한국 공휴일 유틸리티

export interface Holiday {
  date: string; // YYYY-MM-DD 형식
  name: string;
  type: 'national' | 'traditional' | 'commemoration';
}

// 2024-2025년 한국 공휴일 목록
const holidays2024: Holiday[] = [
  { date: '2024-01-01', name: '신정', type: 'national' },
  { date: '2024-02-09', name: '설날 연휴', type: 'traditional' },
  { date: '2024-02-10', name: '설날', type: 'traditional' },
  { date: '2024-02-11', name: '설날 연휴', type: 'traditional' },
  { date: '2024-02-12', name: '대체공휴일', type: 'traditional' },
  { date: '2024-03-01', name: '삼일절', type: 'national' },
  { date: '2024-04-10', name: '국회의원선거일', type: 'commemoration' },
  { date: '2024-05-05', name: '어린이날', type: 'national' },
  { date: '2024-05-06', name: '대체공휴일', type: 'national' },
  { date: '2024-05-15', name: '부처님오신날', type: 'traditional' },
  { date: '2024-06-06', name: '현충일', type: 'commemoration' },
  { date: '2024-08-15', name: '광복절', type: 'national' },
  { date: '2024-09-16', name: '추석 연휴', type: 'traditional' },
  { date: '2024-09-17', name: '추석', type: 'traditional' },
  { date: '2024-09-18', name: '추석 연휴', type: 'traditional' },
  { date: '2024-10-03', name: '개천절', type: 'national' },
  { date: '2024-10-09', name: '한글날', type: 'national' },
  { date: '2024-12-25', name: '성탄절', type: 'national' },
];

const holidays2025: Holiday[] = [
  { date: '2025-01-01', name: '신정', type: 'national' },
  { date: '2025-01-28', name: '설날 연휴', type: 'traditional' },
  { date: '2025-01-29', name: '설날', type: 'traditional' },
  { date: '2025-01-30', name: '설날 연휴', type: 'traditional' },
  { date: '2025-03-01', name: '삼일절', type: 'national' },
  { date: '2025-05-05', name: '어린이날', type: 'national' },
  { date: '2025-05-12', name: '부처님오신날', type: 'traditional' },
  { date: '2025-06-06', name: '현충일', type: 'commemoration' },
  { date: '2025-08-15', name: '광복절', type: 'national' },
  { date: '2025-10-05', name: '추석 연휴', type: 'traditional' },
  { date: '2025-10-06', name: '추석', type: 'traditional' },
  { date: '2025-10-07', name: '추석 연휴', type: 'traditional' },
  { date: '2025-10-08', name: '대체공휴일', type: 'traditional' },
  { date: '2025-10-03', name: '개천절', type: 'national' },
  { date: '2025-10-09', name: '한글날', type: 'national' },
  { date: '2025-12-25', name: '성탄절', type: 'national' },
];

// 모든 공휴일 통합
const allHolidays = [...holidays2024, ...holidays2025];

/**
 * 특정 날짜가 공휴일인지 확인
 */
export function isHoliday(date: Date | string): boolean {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  return allHolidays.some(holiday => holiday.date === dateStr);
}

/**
 * 특정 날짜의 공휴일 정보 가져오기
 */
export function getHoliday(date: Date | string): Holiday | null {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  return allHolidays.find(holiday => holiday.date === dateStr) || null;
}

/**
 * 특정 월의 모든 공휴일 가져오기
 */
export function getHolidaysInMonth(year: number, month: number): Holiday[] {
  const yearMonthStr = `${year}-${String(month).padStart(2, '0')}`;
  return allHolidays.filter(holiday => holiday.date.startsWith(yearMonthStr));
}

/**
 * 특정 연도의 모든 공휴일 가져오기
 */
export function getHolidaysInYear(year: number): Holiday[] {
  const yearStr = `${year}`;
  return allHolidays.filter(holiday => holiday.date.startsWith(yearStr));
}

/**
 * Date를 YYYY-MM-DD 형식으로 변환
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 공휴일 타입별 색상 반환
 */
export function getHolidayColor(type: Holiday['type']): string {
  switch (type) {
    case 'national':
      return 'text-red-600 bg-red-50';
    case 'traditional':
      return 'text-orange-600 bg-orange-50';
    case 'commemoration':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * 주말인지 확인
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
}

/**
 * 공휴일 또는 주말인지 확인
 */
export function isNonWorkingDay(date: Date): boolean {
  return isWeekend(date) || isHoliday(date);
}
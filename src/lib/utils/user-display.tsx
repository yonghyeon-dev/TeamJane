import type { User } from '@supabase/supabase-js'

export interface UserDisplayInfo {
  name: string
  email: string
  initials: string
  avatarUrl?: string
}

/**
 * 사용자 정보를 UI 표시용으로 포맷팅
 * 일관된 사용자 정보 표시를 위한 유틸리티 함수
 */
export function getUserDisplayInfo(user: User | null): UserDisplayInfo {
  if (!user) {
    return {
      name: '사용자',
      email: '',
      initials: '사'
    }
  }

  // 이름 우선순위: full_name > name > email의 @ 앞부분 > '사용자'
  const name = user.user_metadata?.full_name || 
               user.user_metadata?.name || 
               user.email?.split('@')[0] || 
               '사용자'
  
  // 이니셜 생성 (한글/영어 모두 지원)
  const initials = name.length > 0 ? name.charAt(0).toUpperCase() : '사'
  
  return {
    name,
    email: user.email || '',
    initials,
    avatarUrl: user.user_metadata?.avatar_url
  }
}

/**
 * 사용자 이름과 이메일을 포맷팅된 문자열로 반환
 * @param user 사용자 객체
 * @param showEmail 이메일 표시 여부
 * @param separator 이름과 이메일 사이 구분자 (기본값: '')
 */
export function formatUserInfo(
  user: User | null, 
  showEmail: boolean = true, 
  separator: string = ''
): string {
  const displayInfo = getUserDisplayInfo(user)
  
  if (!showEmail || !displayInfo.email) {
    return displayInfo.name
  }
  
  return `${displayInfo.name}${separator}${displayInfo.email}`
}

/**
 * 사용자 이름과 이메일을 수직으로 표시하는 JSX 컴포넌트 반환
 * @param user 사용자 객체
 * @param showEmail 이메일 표시 여부
 * @param nameClassName 이름에 적용할 CSS 클래스
 * @param emailClassName 이메일에 적용할 CSS 클래스
 */
export function formatUserInfoVertical(
  user: User | null,
  showEmail: boolean = true,
  nameClassName: string = 'text-sm font-medium text-gray-900',
  emailClassName: string = 'text-xs text-gray-500'
) {
  const displayInfo = getUserDisplayInfo(user)
  
  if (!showEmail || !displayInfo.email) {
    return (
      <span className={nameClassName}>
        {displayInfo.name}
      </span>
    )
  }
  
  return (
    <div className="flex flex-col">
      <span className={nameClassName}>
        {displayInfo.name}
      </span>
      <span className={emailClassName}>
        {displayInfo.email}
      </span>
    </div>
  )
}

/**
 * 시간을 한국어로 포맷팅 (알림 등에서 사용)
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return '방금 전'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`
  } else if (diffDays < 7) {
    return `${diffDays}일 전`
  } else {
    return date.toLocaleDateString('ko-KR')
  }
}
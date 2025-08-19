import { useEffect, useRef } from 'react'

/**
 * 컴포넌트 언마운트 시 진행 중인 요청을 중단하는 훅
 */
export function useAbortableRequest() {
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const createAbortController = () => {
    // 이전 요청이 있다면 중단
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    return abortControllerRef.current
  }

  const isMounted = () => isMountedRef.current

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  return {
    createAbortController,
    isMounted,
    abort,
    signal: abortControllerRef.current?.signal
  }
}
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.warn('Auth error:', error)
      }
      setLoading(false)
    }

    getUser()

    if (!supabase) {
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    if (!supabase) {
      throw new Error('Supabase가 설정되지 않았습니다. 환경변수를 확인해주세요.')
    }
    
    console.log('회원가입 시도:', { email, name })
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })
      
      console.log('Supabase 응답:', { error, data })
      
      if (error) {
        console.error('Supabase 오류:', error)
        throw new Error(error.message || '회원가입 중 오류가 발생했습니다.')
      }

      // 사용자 프로필 생성은 일단 주석 처리 (Prisma 테이블이 아직 생성되지 않았을 수 있음)
      // if (data.user) {
      //   const { error: profileError } = await supabase
      //     .from('profiles')
      //     .insert([
      //       {
      //         user_id: data.user.id,
      //         name: name,
      //       },
      //     ])
      //   
      //   if (profileError) throw profileError
      // }
      
      return data
    } catch (err) {
      console.error('회원가입 전체 오류:', err)
      throw err
    }
  }

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
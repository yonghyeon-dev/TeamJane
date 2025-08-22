"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  // 소셜 인증 (Google만 지원)
  signInWithGoogle: () => Promise<{ provider: string; url: string } | void>;
  // 공통
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!supabase) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        // 운영환경 감지
        const isProduction = typeof window !== 'undefined' && 
                            (process.env.NODE_ENV === 'production' || 
                             window.location.hostname !== 'localhost');

        // URL 프래그먼트에서 OAuth 토큰 확인 (운영환경 특화)
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log('Auth Context: OAuth 프래그먼트 감지, 세션 설정');
            
            try {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              // URL 정리
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // 운영환경에서 추가 대기
              if (isProduction) {
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } catch (error) {
              console.error('Auth Context: 세션 설정 실패:', error);
            }
          }
        }

        // 사용자 정보 가져오기 (운영환경에서 재시도 로직)
        let attempts = 0;
        const maxAttempts = isProduction ? 5 : 3;
        
        while (attempts < maxAttempts) {
          try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error && !error.message.includes('session_not_found')) {
              console.warn(`Auth Context: 사용자 조회 오류 (시도 ${attempts + 1}):`, error);
            }
            
            if (user) {
              setUser(user);
              console.log('Auth Context: 사용자 인증 완료:', user.email);
              break;
            }
            
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, isProduction ? 500 : 200));
            }
          } catch (error) {
            console.warn(`Auth Context: 네트워크 오류 (시도 ${attempts + 1}):`, error);
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, isProduction ? 500 : 200));
            }
          }
        }
      } catch (error) {
        console.error("Auth Context: 초기화 오류:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    if (!supabase) {
      return;
    }

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth Context: 상태 변경 감지:', event, session?.user?.email);
      
      setUser(session?.user ?? null);
      setLoading(false);
      
      // 로그인 완료 시 자동 리다이렉트 (운영환경 특화)
      if (event === 'SIGNED_IN' && session?.user && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        
        // 콜백 페이지나 로그인 페이지에서만 리다이렉트
        if (currentPath === '/auth/callback' || 
            currentPath === '/auth/login' || 
            currentPath === '/') {
          
          console.log('Auth Context: 로그인 완료, 대시보드로 이동');
          
          // 운영환경에서 안전한 리다이렉트를 위한 지연
          const isProduction = process.env.NODE_ENV === 'production' || 
                              window.location.hostname !== 'localhost';
          
          if (isProduction) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          window.location.href = '/dashboard';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    try {
      // 환경별 URL 설정
      const isDevMode = process.env.NODE_ENV === 'development'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (isDevMode ? 'http://localhost:3000' : 'https://weave-erp.vercel.app')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth 오류:', error);
        throw error;
      }

      console.log('Google OAuth 요청 성공');
      return data;
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      throw error;
    }
  };



  const signOut = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

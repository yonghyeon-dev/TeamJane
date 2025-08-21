"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // 소셜 인증만 지원
  signInWithGoogle: () => Promise<{ provider: string; url: string } | void>;
  signInWithKakao: () => Promise<{ provider: string; url: string } | void>;
  // 공통
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.warn("Auth error:", error);
      }
      setLoading(false);
    };

    getUser();

    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
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

  const signInWithKakao = async () => {
    if (!supabase) {
      throw new Error("Supabase not configured");
    }

    try {
      // 환경별 URL 설정
      const isDevMode = process.env.NODE_ENV === 'development'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
        (isDevMode ? 'http://localhost:3001' : 'https://weave-erp.vercel.app')

      // 카카오톡 OAuth는 Supabase 공식 지원
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });

      if (error) {
        console.error('카카오톡 OAuth 오류:', error);
        throw error;
      }

      console.log('카카오톡 OAuth 요청 성공');
      return data;
    } catch (error) {
      console.error('카카오톡 로그인 실패:', error);
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
        signInWithGoogle,
        signInWithKakao,
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

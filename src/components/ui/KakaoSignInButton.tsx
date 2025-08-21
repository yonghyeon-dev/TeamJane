"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";

interface KakaoSignInButtonProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

export default function KakaoSignInButton({
  className,
  disabled = false,
  children,
  variant = "default",
  size = "md",
}: KakaoSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithKakao } = useAuth();

  const handleSignIn = async () => {
    if (disabled || isLoading) return;

    try {
      setIsLoading(true);
      const result = await signInWithKakao();
      
      if (result?.url) {
        // OAuth 리다이렉트가 발생하는 경우
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("카카오톡 로그인 오류:", error);
      alert("카카오톡 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variantClasses = {
    default: "bg-[#FEE500] hover:bg-[#FDD400] text-black border-[#FEE500]",
    outline: "border-[#FEE500] text-[#3C1E1E] hover:bg-[#FEE500] hover:text-black",
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "border",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>로그인 중...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* 카카오톡 로고 아이콘 */}
          <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M9 0C4.03125 0 0 3.15625 0 7.0625C0 9.75 1.59375 12.0625 4.03125 13.4688L3.09375 16.75L6.75 14.5938C7.46875 14.7188 8.21875 14.7812 9 14.7812C13.9688 14.7812 18 11.625 18 7.71875C18 3.8125 13.9688 0.65625 9 0.65625V0Z"
              fill="currentColor"
            />
          </svg>
          {children || "카카오톡으로 로그인"}
        </div>
      )}
    </button>
  );
}

export type { KakaoSignInButtonProps };
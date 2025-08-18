"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Button from "@/components/ui/Button";
import {
  User,
  Bell,
  LogOut,
  Settings,
  Search,
  ChevronDown,
  Home,
  FolderOpen,
  Users,
  FileText,
  Receipt,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  // 인증된 사용자용 메뉴 아이템
  const authenticatedMenuItems = [
    { label: "대시보드", href: "/dashboard", icon: Home },
    { label: "프로젝트", href: "/projects", icon: FolderOpen },
    { label: "클라이언트", href: "/clients", icon: Users },
    { label: "문서", href: "/documents", icon: FileText },
    { label: "청구서", href: "/invoices", icon: Receipt }
  ];

  // 현재 페이지에 맞는 메뉴 아이템에 active 표시
  const menuItemsWithActive = authenticatedMenuItems.map(item => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + '/')
  }));

  // 푸터 링크 그룹 (인증된 사용자용)
  const footerLinks = [
    {
      title: "워크스페이스",
      links: [
        { label: "대시보드", href: "/dashboard" },
        { label: "프로젝트", href: "/projects" },
        { label: "클라이언트", href: "/clients" },
        { label: "문서", href: "/documents" }
      ]
    },
    {
      title: "관리",
      links: [
        { label: "청구서", href: "/invoices" },
        { label: "설정", href: "/settings" },
        { label: "계정", href: "/auth/login" }
      ]
    },
    {
      title: "지원",
      links: [
        { label: "도움말", href: "#help" },
        { label: "문의", href: "#contact" }
      ]
    }
  ];

  // 소셜 링크
  const socialLinks = [
    { name: "GitHub", href: "#", icon: <Github className="w-5 h-5" /> },
    { name: "Twitter", href: "#", icon: <Twitter className="w-5 h-5" /> },
    { name: "LinkedIn", href: "#", icon: <Linkedin className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Authenticated Navbar */}
      <Navbar
        logo={
          <div className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt="WEAVE Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">WEAVE</span>
          </div>
        }
        menuItems={menuItemsWithActive}
        actions={
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="검색..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.user_metadata?.name || user?.email?.split('@')[0] || '사용자'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.user_metadata?.name || '사용자'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    설정
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer
        logo={
          <div className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt="WEAVE Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-900">WEAVE</span>
          </div>
        }
        links={footerLinks}
        socialLinks={socialLinks}
        copyright="© 2024 WEAVE. 모든 권리 보유."
      />

      {/* Close dropdown when clicking outside */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
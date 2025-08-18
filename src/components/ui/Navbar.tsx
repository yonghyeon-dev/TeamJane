"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./";
import Image from "next/image";

export interface NavbarProps {
  className?: string;
  logo?: React.ReactNode;
  menuItems?: NavbarMenuItem[];
  actions?: React.ReactNode;
  variant?: "default" | "transparent" | "elevated";
}

export interface NavbarMenuItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavbarMenuItem[];
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, menuItems = [], actions, variant = "default" }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const variants = {
      default: "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm",
      transparent: "bg-transparent",
      elevated:
        "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg",
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-fast",
          variants[variant],
          className
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              {logo || (
                <div className="flex items-center space-x-2">
                  <Image
                    src="/favicon.ico"
                    alt="WEAVE Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-gray-900 font-semibold text-lg">
                    WEAVE
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors duration-fast",
                    item.active
                      ? "text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {actions || (
                <>
                  <Button variant="secondary" size="sm">
                    로그인
                  </Button>
                  <Button variant="primary" size="sm">
                    무료 시작
                  </Button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-primary-surfaceHover transition-colors duration-fast"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5 text-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 text-sm font-medium transition-colors duration-fast",
                      item.active
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

export default Navbar;

"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface ThemeToggleProps {
  variant?: "icon" | "pill" | "switch";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a neutral placeholder with same dimensions
    return (
      <div
        className={`h-9 w-9 rounded-full bg-stone-100/60 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "switch") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
          isDark ? "bg-[#8B5CF6]" : "bg-stone-300"
        } ${className}`}
      >
        <span
          className={`pointer-events-none flex h-5 w-5 items-center justify-center transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <Moon size={11} className="text-[#8B5CF6]" />
          ) : (
            <Sun size={11} className="text-amber-500" />
          )}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-md ${
          isDark
            ? "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.12] shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            : "bg-white text-ink hover:bg-stone-100 border border-black/[0.08] shadow-subtle"
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun size={13} className="text-amber-400 animate-spin-slow" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon size={13} className="text-[#8B5CF6]" />
            <span>Dark</span>
          </>
        )}
      </button>
    );
  }

  // Default: round icon button (matching header moon icon in reference portfolio)
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
        isDark
          ? "bg-white/[0.06] text-white hover:bg-white/[0.12] border border-white/[0.1] hover:border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          : "bg-white text-ink hover:bg-stone-100 border border-black/[0.08] shadow-subtle hover:border-black/20"
      } ${className}`}
    >
      {isDark ? (
        <Sun
          size={16}
          className="text-amber-400 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <Moon
          size={16}
          className="text-stone-700 group-hover:text-[#8B5CF6] group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300"
        />
      )}
    </button>
  );
}

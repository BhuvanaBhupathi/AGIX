"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink flex transition-colors duration-200">
      {/* Slim Global Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pl-[230px] relative">
        {/* Top-Right Quick Theme Switcher Pill matching user reference header */}
        <div className="fixed top-5 right-6 z-40 hidden sm:flex items-center gap-3">
          <ThemeToggle variant="pill" />
        </div>

        <div className="mx-auto max-w-6xl px-8 lg:px-12 py-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}

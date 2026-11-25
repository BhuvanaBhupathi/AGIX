"use client";

import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";

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
      <main className="flex-1 min-w-0 pl-[240px] relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

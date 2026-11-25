"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth-context";
import { ProjectsProvider } from "@/lib/projects-context";
import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectsProvider>{children}</ProjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

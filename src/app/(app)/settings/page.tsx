"use client";

import React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-2xl">
      <header className="pb-4 border-b border-border-subtle">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Manage your creative workspace preferences and designer profile.
        </p>
      </header>

      <div className="space-y-6">
        {/* Appearance / Theme Selector */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">Appearance & Theme</h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Customize your studio visual ambiance.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            {/* Dark Option */}
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`relative rounded-xl p-4 text-left border transition-all flex flex-col justify-between h-28 group ${
                theme === "dark"
                  ? "bg-[#08090E] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-[#8B5CF6]"
                  : "bg-[#08090E]/60 border-black/10 hover:border-black/20"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="h-7 w-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#A78BFA]">
                  <Moon size={14} />
                </span>
                {theme === "dark" && (
                  <span className="h-5 w-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-sm">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Obsidian Dark</p>
                <p className="text-[10px] text-slate-400">Deep midnight & violet-cyan accents</p>
              </div>
            </button>

            {/* Light Option */}
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`relative rounded-xl p-4 text-left border transition-all flex flex-col justify-between h-28 group ${
                theme === "light"
                  ? "bg-[#FBFBFA] border-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-[#8B5CF6]"
                  : "bg-[#FBFBFA]/60 border-black/10 hover:border-black/20"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sun size={14} />
                </span>
                {theme === "light" && (
                  <span className="h-5 w-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-sm">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900">Paper Light</p>
                <p className="text-[10px] text-stone-500">Clean, crisp architectural canvas</p>
              </div>
            </button>
          </div>
        </div>

        {/* Designer Profile */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Designer Profile</h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Your name and studio profile displayed across workspaces.
          </p>

          <div className="mt-4 space-y-3 pt-3 border-t border-border-subtle text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-ink-secondary text-xs">Full Name</span>
              <span className="font-medium text-ink text-xs">{user.fullName}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ink-secondary text-xs">Workspace Studio</span>
              <span className="font-medium text-ink text-xs">{user.studio}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ink-secondary text-xs">Role</span>
              <span className="font-medium text-ink text-xs">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Typography & Preferences */}
        <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
          <h2 className="text-base font-semibold text-ink">Typography & Preferences</h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Workspace defaults and typeface settings.
          </p>
          <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-ink-secondary flex items-center justify-between">
            <span>Primary UI Font</span>
            <span className="font-mono text-ink">Satoshi (System Native)</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={logout}>
            Log out from Agix
          </Button>
        </div>
      </div>
    </div>
  );
}

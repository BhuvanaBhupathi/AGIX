"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Bookmark, Lightbulb, Sparkles } from "lucide-react";
import { ContinueWorking } from "@/components/ui/ContinueWorking";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";
import { NewProjectModal } from "@/components/project/NewProjectModal";

/**
 * Calculates greeting based on system local time:
 * - 12-hour: 12:00 AM – 12:00 PM | 24-hour: 00:00 – 12:00 -> Good morning
 * - 12-hour: 01:00 PM – 03:00 PM | 24-hour: 12:00 / 13:00 – 15:00 -> Good afternoon
 * - 12-hour: 03:00 PM – 11:59 PM | 24-hour: 15:00 – 23:59 -> Good evening
 */
function getSystemGreeting(date: Date = new Date()): string {
  const hours = date.getHours(); // 0–23 (standard 24hr representation of local time)
  if (hours >= 0 && hours < 12) {
    return "Good morning";
  } else if (hours >= 12 && hours < 15) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default function HomePage() {
  const { user } = useAuth();
  const { projects, activity, library } = useProjects();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [greeting, setGreeting] = useState<string>(getSystemGreeting);
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    // Set greeting based on client system time
    setGreeting(getSystemGreeting());

    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();

    // Update greeting and time every 20 seconds to automatically transition across thresholds
    const interval = setInterval(() => {
      setGreeting(getSystemGreeting());
      updateTime();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const activeProject = projects.length > 0 ? projects[0] : null;

  // Dynamic library counts
  const fontCount = library.filter((i) => i.type === "font").length;
  const colorCount = library.filter((i) => i.type === "color" || i.type === "palette").length;
  const referenceCount = library.filter((i) => i.type === "reference").length;
  const ideasCount = library.filter((i) => i.type === "direction").length;

  // Recent activity: compact 3 items
  const recentItems =
    activity.length > 0
      ? activity.slice(0, 3)
      : activeProject
      ? [
          {
            id: "rec-1",
            action: "Color Exploration",
            project: activeProject.name,
            timeAgo: activeProject.lastEdited || "2 hours ago",
          },
          {
            id: "rec-2",
            action: "Typography Study",
            project: activeProject.name,
            timeAgo: "Yesterday",
          },
          {
            id: "rec-3",
            action: "Moodboard Direction",
            project: activeProject.name,
            timeAgo: "2 days ago",
          },
        ]
      : [];

  return (
    <div className="relative space-y-10 max-w-5xl">
      {/* Ambient background caustics inspired by AGIX visual identity & reference portfolio */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── 1. Greeting & Primary Action ───────────────────────────────── */}
      <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-7 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          {/* Header Status Badges (reflecting the user reference's "Available for opportunities") */}
          <div className="flex items-center gap-2.5 flex-wrap mb-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] shadow-2xs backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
              <span className="font-semibold tracking-wider uppercase text-[10px]">AGIX Studio</span>
              {timeString && (
                <>
                  <span className="text-purple-300 dark:text-purple-500">·</span>
                  <span className="text-purple-700/80 dark:text-purple-300">{timeString}</span>
                </>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium backdrop-blur-xs shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
              <span>Available for opportunities</span>
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink"
            suppressHydrationWarning
          >
            {greeting},{" "}
            <span className="bg-gradient-to-r from-ink via-[#6D28D9] to-ink dark:from-white dark:via-[#C084FC] dark:to-[#38BDF8] bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-secondary dark:text-slate-400">
            The creative workspace for brand designers. Pick up where you left off.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] dark:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-[1px] active:translate-y-0 self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-2 border border-purple-500/25 ring-1 ring-white/10"
        >
          <Plus size={15} className="text-purple-300 dark:text-white transition-transform duration-300 group-hover:rotate-90" />
          <span>New Project</span>
        </button>
      </header>

      {/* ── 2. Continue Working ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary">
            Continue Working
          </h2>
          {activeProject && (
            <Link
              href="/projects"
              className="text-[11px] text-ink-tertiary hover:text-ink dark:hover:text-white transition-colors duration-150 font-mono focus-visible:outline-none focus-visible:underline"
            >
              All projects ({projects.length}) →
            </Link>
          )}
        </div>

        {activeProject ? (
          <ContinueWorking project={activeProject} />
        ) : (
          <div className="rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-ink">No projects yet.</p>
              <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1">
                Create your first brand workspace to explore typography, color systems, and visual guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink dark:bg-[#8B5CF6] text-white hover:bg-[#1E1B4B] dark:hover:bg-[#7C3AED] text-xs font-medium transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-2"
            >
              <Plus size={14} />
              <span>Create Project</span>
            </button>
          </div>
        )}
      </section>

      {/* ── 3. Creative Library ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary">
            Creative Library
          </h2>
          <Link
            href="/library"
            className="text-[11px] text-ink-tertiary hover:text-[#6D28D9] dark:hover:text-[#A78BFA] transition-colors duration-150 font-mono focus-visible:outline-none focus-visible:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fonts */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-6 hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50/60 dark:from-purple-500/10 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-purple-50 dark:from-[#141724] dark:to-[#1E2235] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center font-serif text-2xl font-light text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                Aa
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                  Fonts
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {fontCount} saved
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary dark:text-slate-400 group-hover:text-ink dark:group-hover:text-white transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Browse catalogue</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink dark:text-white group-hover:bg-[#181126] dark:group-hover:bg-[#8B5CF6] group-hover:text-purple-300 dark:group-hover:text-white transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 2: Colors */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-6 hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-50/60 dark:from-cyan-500/10 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-gradient-to-br from-[#F4F8FA] to-purple-50/40 dark:from-[#141724] dark:to-[#1E2235] border border-black/[0.05] dark:border-white/[0.08] shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <span className="h-3 w-3 rounded-full bg-[#191918] border border-black/10 dark:border-white/20" />
                <span className="h-3 w-3 rounded-full bg-[#8B5CF6] border border-black/10 dark:border-white/20" />
                <span className="h-3 w-3 rounded-full bg-[#4DD4CD] border border-black/10 dark:border-white/20" />
                <span className="h-3 w-3 rounded-full bg-[#E8973A] border border-black/10 dark:border-white/20" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                  Colors
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {colorCount} palettes
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary dark:text-slate-400 group-hover:text-ink dark:group-hover:text-white transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Explore palettes</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink dark:text-white group-hover:bg-[#181126] dark:group-hover:bg-[#8B5CF6] group-hover:text-purple-300 dark:group-hover:text-white transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 3: References */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-6 hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50/60 dark:from-amber-500/10 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-amber-50/60 dark:from-[#141724] dark:to-[#1E2235] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <Bookmark size={17} className="text-ink" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                  References
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {referenceCount} saved
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary dark:text-slate-400 group-hover:text-ink dark:group-hover:text-white transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">View references</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink dark:text-white group-hover:bg-[#181126] dark:group-hover:bg-[#8B5CF6] group-hover:text-purple-300 dark:group-hover:text-white transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 4: Saved Ideas */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-6 hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50/60 dark:from-purple-500/10 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-purple-50/60 dark:from-[#141724] dark:to-[#1E2235] border border-black/[0.05] dark:border-white/[0.08] flex items-center justify-center text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <Lightbulb size={17} className="text-[#8B5CF6]" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                  Saved Ideas
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {ideasCount} boards
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary dark:text-slate-400 group-hover:text-ink dark:group-hover:text-white transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Open boards</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink dark:text-white group-hover:bg-[#181126] dark:group-hover:bg-[#8B5CF6] group-hover:text-purple-300 dark:group-hover:text-white transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 4. Recent Activity ───────────────────────────────────────── */}
      <section className="pt-2">
        <div className="mb-3.5 px-1 flex items-center justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary">
            Recent Activity
          </h2>
          <span className="text-[10px] font-mono text-purple-700/80 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-500/30">
            Live Stream
          </span>
        </div>
        {recentItems.length > 0 ? (
          <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-2 divide-y divide-stone-100 dark:divide-white/[0.04] shadow-sm overflow-hidden">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="group px-4 py-3.5 rounded-2xl flex items-center justify-between text-xs hover:bg-stone-50/80 dark:hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] ring-4 ring-purple-500/15 shrink-0 group-hover:scale-125 transition-transform duration-200" />
                  <span className="font-medium text-ink truncate group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                    {item.action}
                  </span>
                  <span className="text-ink-tertiary">·</span>
                  <span className="text-ink-secondary dark:text-slate-400 truncate">
                    {item.project}
                  </span>
                </div>
                <span className="text-[10px] text-ink-tertiary dark:text-slate-400 font-mono shrink-0 ml-4 px-2.5 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {item.timeAgo}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 px-6 py-4 text-xs text-ink-tertiary shadow-sm">
            No recent activity yet.
          </div>
        )}
      </section>

      {/* New Project Modal Flow */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}

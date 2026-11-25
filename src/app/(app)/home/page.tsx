"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Bookmark, Lightbulb } from "lucide-react";
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
      {/* Ambient background caustics inspired by AGIX visual identity */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60" />

      {/* ── 1. Greeting & Primary Action ───────────────────────────────── */}
      <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-7 border-b border-black/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-200/60 text-[11px] font-mono text-[#6D28D9] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-[10px]">AGIX Studio</span>
            {timeString && (
              <>
                <span className="text-purple-300">·</span>
                <span className="text-purple-700/80">{timeString}</span>
              </>
            )}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink"
            suppressHydrationWarning
          >
            {greeting}, <span className="bg-gradient-to-r from-ink via-ink to-[#6D28D9] bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-secondary">
            The creative workspace for brand designers. Pick up where you left off.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.25)] hover:-translate-y-[1px] active:translate-y-0 self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-2 border border-purple-500/25 ring-1 ring-white/10"
        >
          <Plus size={15} className="text-purple-300 transition-transform duration-300 group-hover:rotate-90" />
          <span>New Project</span>
        </button>
      </header>

      {/* ── Brand Visual Showcase Banner ────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-[#0A0A0C] shadow-[0_12px_36px_rgba(0,0,0,0.08)] group">
        <img
          src="/agix-banner.jpg"
          alt="AGIX The Creative Workspace for Brand Designers"
          className="w-full h-44 sm:h-56 object-cover object-center opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-purple-300/90 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] animate-pulse" />
                Spatial Brand Canvas
              </p>
              <h2 className="text-white text-base sm:text-lg font-medium tracking-tight mt-0.5">
                Explore, test, and approve brand directions
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-all duration-200 self-start sm:self-auto hover:border-purple-300/40 hover:shadow-[0_0_16px_rgba(168,85,247,0.3)]"
            >
              <span>Explore Inspiration</span>
              <ArrowRight size={13} className="text-purple-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Continue Working ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary">
            Continue Working
          </h2>
          {activeProject && (
            <Link
              href="/projects"
              className="text-[11px] text-ink-tertiary hover:text-ink transition-colors duration-150 font-mono focus-visible:outline-none focus-visible:underline"
            >
              All projects ({projects.length}) →
            </Link>
          )}
        </div>

        {activeProject ? (
          <ContinueWorking project={activeProject} />
        ) : (
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-ink">No projects yet.</p>
              <p className="text-xs text-ink-secondary mt-1">
                Create your first brand workspace to explore typography, color systems, and visual guidelines.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-white hover:bg-[#1E1B4B] text-xs font-medium transition-all duration-200 ease-out shadow-sm hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2"
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
            className="text-[11px] text-ink-tertiary hover:text-[#6D28D9] transition-colors duration-150 font-mono focus-visible:outline-none focus-visible:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fonts */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white p-6 hover:border-[#8B5CF6]/30 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50/60 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-purple-50 border border-black/[0.05] flex items-center justify-center font-serif text-2xl font-light text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                Aa
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] transition-colors">
                  Fonts
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-black/[0.03]">
                  {fontCount} saved
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary group-hover:text-ink transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Browse catalogue</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 text-ink group-hover:bg-[#181126] group-hover:text-purple-300 transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 2: Colors */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white p-6 hover:border-[#8B5CF6]/30 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-50/60 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-gradient-to-br from-[#F4F8FA] to-purple-50/40 border border-black/[0.05] shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <span className="h-3 w-3 rounded-full bg-[#191918] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#8B5CF6] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#4DD4CD] border border-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#E8973A] border border-black/10" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] transition-colors">
                  Colors
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-black/[0.03]">
                  {colorCount} palettes
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary group-hover:text-ink transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Explore palettes</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 text-ink group-hover:bg-[#181126] group-hover:text-purple-300 transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 3: References */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white p-6 hover:border-[#8B5CF6]/30 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50/60 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-amber-50/60 border border-black/[0.05] flex items-center justify-center text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <Bookmark size={17} className="text-ink" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] transition-colors">
                  References
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-black/[0.03]">
                  {referenceCount} saved
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary group-hover:text-ink transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">View references</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 text-ink group-hover:bg-[#181126] group-hover:text-purple-300 transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>

          {/* Card 4: Saved Ideas */}
          <Link
            href="/library"
            className="group relative overflow-hidden rounded-[26px] border border-black/[0.06] bg-white p-6 hover:border-[#8B5CF6]/30 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/20 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-50/60 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F4F8FA] to-purple-50/60 border border-black/[0.05] flex items-center justify-center text-ink shadow-2xs transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                <Lightbulb size={17} className="text-[#8B5CF6]" />
              </div>
              <div className="mt-5">
                <h3 className="text-base font-semibold text-ink tracking-tight group-hover:text-[#6D28D9] transition-colors">
                  Saved Ideas
                </h3>
                <span className="inline-block mt-1 text-[11px] font-mono text-ink-secondary px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-black/[0.03]">
                  {ideasCount} boards
                </span>
              </div>
            </div>
            <div className="mt-6 pt-3 flex items-center justify-between text-xs text-ink-secondary group-hover:text-ink transition-colors duration-200 relative z-10">
              <span className="font-medium text-xs">Open boards</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 text-ink group-hover:bg-[#181126] group-hover:text-purple-300 transition-all duration-200 ease-out flex items-center justify-center shadow-none group-hover:shadow-sm">
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 4. Recent (Compact secondary section in squircle container) ── */}
      <section className="pt-2">
        <div className="mb-3.5 px-1 flex items-center justify-between">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-ink-tertiary">
            Recent Activity
          </h2>
          <span className="text-[10px] font-mono text-purple-700/70 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
            Live Stream
          </span>
        </div>
        {recentItems.length > 0 ? (
          <div className="rounded-[26px] border border-black/[0.06] bg-white p-2 divide-y divide-stone-100 shadow-sm overflow-hidden">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="group px-4 py-3.5 rounded-2xl flex items-center justify-between text-xs hover:bg-stone-50/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] ring-4 ring-purple-500/15 shrink-0 group-hover:scale-125 transition-transform duration-200" />
                  <span className="font-medium text-ink truncate group-hover:text-[#6D28D9] transition-colors">
                    {item.action}
                  </span>
                  <span className="text-ink-tertiary">·</span>
                  <span className="text-ink-secondary truncate">
                    {item.project}
                  </span>
                </div>
                <span className="text-[10px] text-ink-tertiary font-mono shrink-0 ml-4 px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-black/[0.03]">
                  {item.timeAgo}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-black/[0.06] bg-white px-6 py-4 text-xs text-ink-tertiary shadow-sm">
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

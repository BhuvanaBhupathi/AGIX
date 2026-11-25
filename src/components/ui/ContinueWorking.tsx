import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BrandProject } from "@/lib/data";

export interface ContinueWorkingProps {
  project: BrandProject;
}

export function ContinueWorking({ project }: ContinueWorkingProps) {
  const palette = project.visualPreview?.palette || ["#191918", "#E8973A", "#4DD4CD", "#FAFAF7"];
  const monogram = project.visualPreview?.monogram || project.name.slice(0, 1).toUpperCase();

  return (
    <Link
      href={`/project/${project.id}`}
      className="group relative block rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-5 sm:p-6 hover:border-black/[0.14] dark:hover:border-[#8B5CF6]/50 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_36px_rgba(139,92,246,0.15)] hover:-translate-y-[2px] transition-all duration-300 ease-out overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-2"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4DD4CD]/5 dark:from-[#8B5CF6]/10 via-transparent to-transparent rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 relative z-10">
        {/* Visual Preview Thumbnail */}
        <div className="sm:w-48 h-32 sm:h-28 rounded-[20px] bg-gradient-to-br from-[#F4F8FA] to-[#E9F3F6] dark:from-[#131626] dark:to-[#181B30] border border-black/[0.05] dark:border-white/[0.08] p-4 flex flex-col justify-between shrink-0 transition-all duration-300 group-hover:shadow-inner">
          <div className="flex items-center justify-between">
            <span className="h-8 w-8 rounded-2xl bg-white/95 dark:bg-white/[0.08] backdrop-blur-xs border border-black/[0.06] dark:border-white/10 flex items-center justify-center font-serif text-sm font-semibold text-ink shadow-2xs transition-transform duration-200 ease-out group-hover:-translate-y-[1px]">
              {monogram}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary dark:text-slate-400 px-2 py-0.5 rounded-full bg-white/90 dark:bg-white/[0.06] backdrop-blur-xs border border-black/[0.04] dark:border-white/[0.05]">
              Canvas
            </span>
          </div>
          {/* Palette preview dots in a soft pill tray */}
          <div className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-white/[0.08] backdrop-blur-xs border border-black/[0.04] dark:border-white/10 shadow-2xs transition-transform duration-200 ease-out group-hover:translate-y-[0.5px]">
            {palette.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full border border-black/10 dark:border-white/20 shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Project Details & Metadata */}
        <div className="flex-1 flex flex-col justify-between gap-3 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink truncate group-hover:text-black dark:group-hover:text-white transition-colors duration-150">
                  {project.name}
                </h3>
                <span className="shrink-0 text-[11px] font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                  {project.type}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-secondary dark:text-slate-400 truncate">
                Client: <span className="text-ink font-medium">{project.client}</span>
              </p>
            </div>

            {/* Pill Progress / Status indicator */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5F8] dark:bg-cyan-950/40 border border-[#D0EBF2] dark:border-cyan-500/30 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#4DD4CD] shadow-[0_0_8px_#4DD4CD] animate-pulse" />
              <span className="text-xs font-mono font-medium text-ink dark:text-cyan-300">
                78%
              </span>
            </div>
          </div>

          {/* Bottom Bar with capsule progress track and circular action */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-36 h-2 rounded-full bg-stone-100 dark:bg-white/[0.08] overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#191918] via-[#4DD4CD] to-[#2563EB] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] w-[78%]" />
              </div>
              <span className="text-ink-tertiary dark:text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                <Clock size={12} className="text-ink-tertiary dark:text-slate-400" />
                <span>{project.lastEdited}</span>
              </span>
            </div>

            {/* Circular action button */}
            <div className="w-10 h-10 rounded-full bg-[#111827] dark:bg-gradient-to-r dark:from-[#8B5CF6] dark:to-[#38BDF8] text-white flex items-center justify-center group-hover:bg-[#1E1B4B] dark:group-hover:scale-110 group-hover:scale-105 transition-all duration-200 ease-out shadow-sm dark:shadow-[0_0_15px_rgba(139,92,246,0.35)] shrink-0">
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Sparkles, Layers } from "lucide-react";
import { BrandProject } from "@/lib/data";

interface ProjectSelectorHeaderProps {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description: string;
  projects: BrandProject[];
  selectedProject: BrandProject | null;
  onSelectProject: (project: BrandProject) => void;
  actions?: React.ReactNode;
}

export function ProjectSelectorHeader({
  badge,
  badgeIcon,
  title,
  description,
  projects,
  selectedProject,
  onSelectProject,
  actions,
}: ProjectSelectorHeaderProps) {
  return (
    <header className="relative pb-6 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-5">
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] shadow-2xs backdrop-blur-xs">
            {badgeIcon || (
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            )}
            <span className="font-semibold tracking-wider uppercase text-[10px]">{badge}</span>
          </div>

          {/* Active Project Dropdown Switcher */}
          {projects.length > 0 && selectedProject && (
            <div className="relative group">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 dark:bg-[#131524] border border-black/[0.06] dark:border-white/[0.1] text-xs font-medium text-ink cursor-pointer hover:border-[#8B5CF6]/50 transition-colors shadow-2xs">
                <Layers size={13} className="text-[#8B5CF6]" />
                <span className="truncate max-w-[180px]">{selectedProject.name}</span>
                <span className="text-[10px] font-mono text-ink-tertiary dark:text-slate-400">
                  ({selectedProject.client})
                </span>
                <ChevronDown size={12} className="text-ink-tertiary" />
              </div>

              {/* Native invisible selector over the custom pill */}
              <select
                aria-label="Select active project"
                value={selectedProject.id}
                onChange={(e) => {
                  const found = projects.find((p) => p.id === e.target.value);
                  if (found) onSelectProject(found);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.client}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-secondary dark:text-slate-400 max-w-2xl">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {selectedProject && (
          <Link
            href={`/project/${selectedProject.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#0E1018] text-xs font-medium text-ink hover:border-[#8B5CF6]/50 hover:shadow-sm transition-all"
          >
            <span>Open in Canvas</span>
            <ExternalLink size={12} className="text-ink-tertiary" />
          </Link>
        )}
        {actions}
      </div>
    </header>
  );
}

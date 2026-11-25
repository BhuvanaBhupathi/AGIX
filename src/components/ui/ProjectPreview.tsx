import React from "react";
import Link from "next/link";
import { BrandProject } from "@/lib/data";
import { ArrowUpRight, Trash2 } from "lucide-react";

export interface ProjectPreviewProps {
  project: BrandProject;
  onClick?: () => void;
  onDelete?: (id: string, name: string) => void;
}

export function ProjectPreview({ project, onClick, onDelete }: ProjectPreviewProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(project.id, project.name);
    }
  };

  const visualPreview = project.visualPreview || {
    monogram: (project.name || "AG").slice(0, 2).toUpperCase(),
    fontSpecimen: "Satoshi",
    secondaryFont: "Inter",
    palette: ["#191918", "#EBEBE7", "#F7F7F5"],
    gridAccent: "#191918",
  };
  const monogram = visualPreview.monogram || (project.name || "AG").slice(0, 2).toUpperCase();
  const fontSpecimen = visualPreview.fontSpecimen || "Satoshi";
  const secondaryFont = visualPreview.secondaryFont || "Inter";
  const palette = Array.isArray(visualPreview.palette) && visualPreview.palette.length > 0
    ? visualPreview.palette
    : ["#191918", "#EBEBE7", "#F7F7F5"];

  return (
    <div className="group relative rounded-[24px] border border-border-subtle bg-surface p-4 transition-all duration-300 hover:border-[#8B5CF6]/50 hover:shadow-[0_12px_32px_rgba(139,92,246,0.14)] hover:-translate-y-1 flex flex-col justify-between">
      <Link
        href={`/project/${project.id}`}
        onClick={onClick}
        className="block cursor-pointer"
      >
        {/* Visual Composition / Thumbnail */}
        <div className="relative aspect-[16/10] w-full rounded-[18px] bg-surface-subtle dark:bg-[#131626] p-5 border border-border-subtle flex flex-col justify-between overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-tertiary dark:text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.05]">
              {project.status}
            </span>
            <span className="font-serif text-lg text-ink dark:text-white font-light">
              {monogram}
            </span>
          </div>

          <div className="py-2">
            <p className="text-xl font-medium tracking-tight text-ink dark:text-white">
              {fontSpecimen}
            </p>
            <p className="text-[11px] text-ink-secondary dark:text-slate-400 mt-0.5 font-mono">
              {secondaryFont}
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-border-subtle/70">
            {palette.map((c, i) => (
              <span
                key={i}
                style={{ backgroundColor: c }}
                className="h-2.5 w-6 rounded-sm border border-black/10 dark:border-white/20"
              />
            ))}
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold tracking-tight text-ink group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                {project.name}
              </h4>
              <span className="text-[11px] text-ink-tertiary">•</span>
              <span className="text-xs text-ink-secondary dark:text-slate-400">{project.type}</span>
            </div>
            <p className="mt-0.5 text-xs text-ink-tertiary dark:text-slate-400">
              {project.client} • {project.lastEdited}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-ink dark:text-white" />
          </div>
        </div>
      </Link>

      {/* Delete button (quiet hover action) */}
      {onDelete && (
        <button
          type="button"
          onClick={handleDeleteClick}
          title={`Delete ${project.name}`}
          className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-surface/90 dark:bg-[#1A1D2E] hover:bg-red-50 dark:hover:bg-red-950/50 text-ink-tertiary hover:text-red-600 dark:hover:text-red-400 border border-border-subtle hover:border-red-200 dark:hover:border-red-500/30 transition-all shadow-subtle cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

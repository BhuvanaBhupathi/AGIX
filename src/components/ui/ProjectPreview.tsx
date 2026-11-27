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
      {/* Visual Composition / Thumbnail */}
      <Link
        href={`/project/${project.id}`}
        onClick={onClick}
        className="block cursor-pointer"
      >
        <div className="relative aspect-[16/10] w-full rounded-[18px] bg-surface-subtle dark:bg-[#131626] p-5 border border-border-subtle flex flex-col justify-between overflow-hidden transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-tertiary dark:text-slate-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.05]">
              {project.status}
            </span>
            <span className="font-serif text-2xl text-ink dark:text-white font-normal leading-none select-none">
              {monogram}
            </span>
          </div>

          <div className="py-2">
            <p className="text-xl font-bold tracking-tight text-ink dark:text-white uppercase font-sans">
              {fontSpecimen}
            </p>
            <p className="text-[11px] text-ink-secondary dark:text-slate-400 mt-1 font-mono uppercase tracking-wider">
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
      </Link>

      {/* Meta info & Action Controls (clean layout, zero monogram collisions) */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <Link
          href={`/project/${project.id}`}
          onClick={onClick}
          className="min-w-0 flex-1 block cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold tracking-tight text-ink group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors font-sans truncate">
              {project.name}
            </h4>
            <span className="text-[11px] text-ink-tertiary">•</span>
            <span className="text-xs text-ink-secondary dark:text-slate-400 font-mono text-[11px] shrink-0">{project.type}</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-tertiary dark:text-slate-400 font-mono text-[11px] truncate">
            {project.client} • {project.lastEdited}
          </p>
        </Link>

        <div className="flex items-center gap-1 shrink-0">
          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              title={`Delete ${project.name}`}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/50 text-ink-tertiary hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-all cursor-pointer"
            >
              <Trash2 size={13} />
            </button>
          )}
          <Link
            href={`/project/${project.id}`}
            onClick={onClick}
            className="p-1.5 text-ink-tertiary group-hover:text-ink dark:group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

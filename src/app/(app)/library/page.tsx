"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Search, Trash2, X, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CanvasItem, LibraryItem } from "@/lib/data";
import { useProjects } from "@/lib/projects-context";

const FILTERS = ["All", "Fonts", "Colors", "Palettes", "References", "Directions"] as const;
type Filter = (typeof FILTERS)[number];

const TYPE_LABEL: Record<string, string> = {
  font: "Font",
  color: "Color",
  palette: "Palette",
  reference: "Reference",
  direction: "Direction",
};

const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  font: { width: 280, height: 200 },
  color: { width: 180, height: 220 },
  palette: { width: 320, height: 160 },
  reference: { width: 240, height: 280 },
  direction: { width: 380, height: 280 },
};

function Preview({ item }: { item: LibraryItem }) {
  const content = item.content || {};

  if (item.type === "color") {
    const hex = content.hex ?? "#191918";
    return (
      <div
        className="h-24 rounded-2xl border border-black/10 shadow-sm flex items-end p-2.5"
        style={{ background: hex }}
      >
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
          {String(hex).toUpperCase()}
        </span>
      </div>
    );
  }

  if (item.type === "palette") {
    const colors = (content.colors as { hex?: string }[] | undefined) || [];
    const fallback = [{ hex: "#191918" }, { hex: "#5A5A55" }, { hex: "#BCBCB6" }, { hex: "#FBFBFA" }];
    const swatches = colors.length ? colors : fallback;
    return (
      <div className="flex h-24 overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
        {swatches.map((color, index) => (
          <span key={index} className="flex-1 h-full" style={{ background: color.hex ?? "#191918" }} />
        ))}
      </div>
    );
  }

  if (item.type === "font") {
    return (
      <div
        className="h-24 rounded-2xl border border-black/[0.06] bg-[#F4F8FA] px-4 flex items-center text-3xl text-ink shadow-sm"
        style={{ fontFamily: content.fontFamily ?? "inherit" }}
      >
        {content.previewText ?? "Aa"}
      </div>
    );
  }

  const imageUrl = item.imageUrl || content.url || content.imageUrl;
  if (imageUrl) {
    return (
      <div className="h-36 rounded-2xl overflow-hidden bg-surface-subtle border border-black/[0.06] shadow-sm relative group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="h-24 rounded-2xl border border-black/[0.06] bg-[#F4F8FA] p-3 flex flex-col justify-between text-xs text-ink-secondary leading-relaxed shadow-sm">
      <p className="line-clamp-2">{content.description ?? content.note ?? item.notes ?? "Saved creative direction"}</p>
      {content.source && <span className="text-[10px] font-mono text-ink-tertiary">{content.source}</span>}
    </div>
  );
}

export default function LibraryPage() {
  const { library, projects, updateProjectCanvas, removeFromLibrary, linkItemToProject } = useProjects();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [itemToAdd, setItemToAdd] = useState<LibraryItem | null>(null);

  const items = useMemo(() => {
    return (library || []).filter((item) => {
      if (!item) return false;
      const label = TYPE_LABEL[item.type] ?? item.type;
      const matchesFilter = filter === "All" || label.toLowerCase() === filter.toLowerCase().replace(/s$/, "");
      const search = query.trim().toLowerCase();
      const matchesQuery = !search || (item.name || "").toLowerCase().includes(search);
      return matchesFilter && matchesQuery;
    });
  }, [filter, library, query]);

  const addToProject = (projectId: string) => {
    if (!itemToAdd) return;
    const project = projects.find((candidate) => candidate.id === projectId);
    if (!project) return;
    const size = DEFAULT_SIZES[itemToAdd.type] || { width: 260, height: 200 };
    const offset = (project.canvasObjects?.length ?? 0) * 24;
    const canvasItem: CanvasItem = {
      id: `${itemToAdd.type}-${Date.now()}`,
      type: itemToAdd.type,
      x: 180 + (offset % 240),
      y: 140 + (offset % 180),
      width: size.width,
      height: size.height,
      zIndex: Math.max(0, ...(project.canvasObjects ?? []).map((item) => item.zIndex ?? 0)) + 1,
      content: { ...(itemToAdd.content || {}) },
    };
    updateProjectCanvas(project.id, [...(project.canvasObjects ?? []), canvasItem]);
    linkItemToProject?.(itemToAdd.id, project.id);
    setItemToAdd(null);
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "Recently";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? "Recently" : d.toLocaleDateString();
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 pb-6 border-b border-black/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-200/60 text-[11px] font-mono text-[#6D28D9] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <FolderOpen size={12} />
            <span>Design System Tokens & Assets</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-ink mt-0.5">
            Creative Library <span className="text-ink-tertiary font-normal text-2xl font-mono">({library.length})</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-secondary">
            Your persistent collection of saved fonts, colors, palettes, and visual references.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.25)] hover:-translate-y-[1px] active:translate-y-0 border border-purple-500/25 ring-1 ring-white/10 shrink-0"
          >
            <Sparkles size={14} className="text-purple-300 transition-transform duration-300 group-hover:rotate-12" />
            <span>Discover Inspiration</span>
          </Link>
        </div>
      </header>

      {/* ── Filter Bar & Search ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1.5 p-1 rounded-full bg-stone-100/80 border border-black/[0.04] w-fit overflow-x-auto backdrop-blur-xs">
          {FILTERS.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setFilter(entry)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${filter === entry
                  ? "bg-white text-ink shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80"
                  : "text-ink-secondary hover:text-ink hover:bg-white/50"
                }`}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved items..."
            className="w-full h-10 pl-9 pr-8 rounded-full border border-black/[0.06] bg-white text-xs text-ink placeholder:text-ink-tertiary focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none transition-all shadow-2xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Library Items Grid ─────────────────────────────────────────── */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="group rounded-[26px] border border-black/[0.06] bg-white p-5 hover:border-[#8B5CF6]/30 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-ink-secondary px-2.5 py-0.5 rounded-full bg-stone-100 border border-black/[0.03]">
                    {TYPE_LABEL[item.type] || item.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromLibrary(item.id)}
                    title={`Remove ${item.name}`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-ink-tertiary hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <Preview item={item} />

                <div className="mt-3.5">
                  <h2 className="text-sm font-semibold text-ink truncate" title={item.name}>
                    {item.name}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-mono text-ink-tertiary">
                    Saved {formatDate(item.savedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.04]">
                <button
                  type="button"
                  onClick={() => setItemToAdd(item)}
                  className="w-full py-2 px-3 rounded-full border border-black/[0.06] bg-[#F8FAFC] hover:bg-[#111827] hover:text-white hover:border-transparent text-ink text-xs font-medium transition-all flex items-center justify-center gap-1.5 group/btn shadow-none hover:shadow-sm"
                >
                  <Plus size={13} className="text-ink group-hover/btn:text-white transition-colors" />
                  <span>Add to project</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-border-subtle bg-white/60 p-16 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center text-ink-tertiary mb-3 shadow-sm">
            <FolderOpen size={20} />
          </div>
          <h2 className="text-sm font-semibold text-ink">
            {library.length ? "No matching saved items" : "Your creative library is waiting"}
          </h2>
          <p className="mt-1 text-xs text-ink-secondary max-w-sm mx-auto leading-relaxed">
            {library.length
              ? "Try adjusting your category filter or search query."
              : "Discover inspiration in Explore or save elements from your canvas to build your persistent memory."}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-ink text-white text-xs font-medium hover:bg-[#1E1B4B] transition-colors shadow-sm"
          >
            <Sparkles size={13} />
            <span>Browse Explore</span>
          </Link>
        </div>
      )}

      {/* ── Add to Project Modal ───────────────────────────────────────── */}
      {itemToAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setItemToAdd(null)}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border border-black/[0.06] bg-white p-5 shadow-lifted"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">
                  Add to Canvas
                </p>
                <h2 className="text-sm font-semibold text-ink mt-0.5 truncate max-w-[240px]">
                  {itemToAdd.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setItemToAdd(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-tertiary hover:text-ink hover:bg-stone-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="py-3 max-h-72 overflow-y-auto space-y-1">
              <p className="text-[11px] text-ink-tertiary font-medium px-2 mb-1.5">
                Select target project canvas:
              </p>
              {projects.length ? (
                projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => addToProject(project.id)}
                    className="w-full text-left rounded-2xl px-3.5 py-2.5 hover:bg-[#EAF5F8] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-ink group-hover:text-ink">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-ink-tertiary mt-0.5">
                        {project.client} · {project.type}
                      </p>
                    </div>
                    <Plus size={13} className="text-ink-tertiary group-hover:text-ink" />
                  </button>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-xs text-ink-secondary">
                  Create a project first before adding library items to a canvas.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

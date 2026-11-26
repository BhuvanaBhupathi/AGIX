"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Search, Trash2, X, ExternalLink, Sparkles, Palette } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CanvasItem, LibraryItem } from "@/lib/data";
import { useProjects } from "@/lib/projects-context";
import { OklchColorLab } from "@/components/color-lab/OklchColorLab";
import { CanvaColorWheel } from "@/components/color-lab/CanvaColorWheel";
import { Disc, Layers } from "lucide-react";

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
        className="h-24 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm flex items-end p-2.5"
        style={{ background: hex }}
      >
        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10">
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
      <div className="flex h-24 overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/10 shadow-sm">
        {swatches.map((color, index) => (
          <span key={index} className="flex-1 h-full" style={{ background: color.hex ?? "#191918" }} />
        ))}
      </div>
    );
  }

  if (item.type === "font") {
    return (
      <div
        className="h-24 rounded-2xl border border-black/[0.06] dark:border-white/10 bg-[#F4F8FA] dark:bg-[#141724] px-4 flex items-center text-3xl text-ink shadow-sm"
        style={{ fontFamily: content.fontFamily ?? "inherit" }}
      >
        {content.previewText ?? "Aa"}
      </div>
    );
  }

  const imageUrl = item.imageUrl || content.url || content.imageUrl;
  if (imageUrl) {
    return (
      <div className="h-36 rounded-2xl overflow-hidden bg-surface-subtle dark:bg-[#141724] border border-black/[0.06] dark:border-white/10 shadow-sm relative group">
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
    <div className="h-24 rounded-2xl border border-black/[0.06] dark:border-white/10 bg-[#F4F8FA] dark:bg-[#141724] p-3 flex flex-col justify-between text-xs text-ink-secondary dark:text-slate-400 leading-relaxed shadow-sm">
      <p className="line-clamp-2">{content.description ?? content.note ?? item.notes ?? "Saved creative direction"}</p>
      {content.source && <span className="text-[10px] font-mono text-ink-tertiary dark:text-slate-500">{content.source}</span>}
    </div>
  );
}

export default function LibraryPage() {
  const { library, projects, updateProjectCanvas, removeFromLibrary, linkItemToProject } = useProjects();
  const [activeTab, setActiveTab] = useState<"wheel" | "spectral" | "library">("wheel");
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
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <FolderOpen size={12} />
            <span>Design System Tokens & Assets</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink mt-0.5">
            Creative Library <span className="text-ink-tertiary dark:text-slate-400 font-normal text-2xl font-mono">({library.length})</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-secondary dark:text-slate-400">
            Your persistent collection of saved fonts, colors, palettes, and visual references.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] dark:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-[1px] active:translate-y-0 border border-purple-500/25 ring-1 ring-white/10 shrink-0"
          >
            <Sparkles size={14} className="text-purple-300 dark:text-white transition-transform duration-300 group-hover:rotate-12" />
            <span>Discover Inspiration</span>
          </Link>
        </div>
      </header>

      {/* ── View Mode Switcher: Color Wheel vs OKLCH Spectral Lab vs Saved Asset Grid ──── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-100/90 dark:bg-[#11131E] border border-black/[0.06] dark:border-white/[0.08] w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("wheel")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "wheel"
              ? "bg-[#7C3AED] text-white shadow-md shadow-purple-500/25"
              : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/40 dark:hover:bg-white/[0.04]"
          }`}
        >
          <Disc size={13} />
          <span>Color Wheel</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("spectral")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "spectral"
              ? "bg-[#EC4899] text-white shadow-md shadow-pink-500/25"
              : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/40 dark:hover:bg-white/[0.04]"
          }`}
        >
          <Layers size={13} />
          <span>OKLCH Spectral Lab</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "library"
              ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-sm border border-black/[0.04] dark:border-white/[0.08]"
              : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/40 dark:hover:bg-white/[0.04]"
          }`}
        >
          <FolderOpen size={13} />
          <span>Saved Brand Assets ({library.length})</span>
        </button>
      </div>

      {activeTab === "wheel" ? (
        <CanvaColorWheel />
      ) : activeTab === "spectral" ? (
        <OklchColorLab />
      ) : (
        <>
          {/* ── Filter Bar & Search ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] w-fit overflow-x-auto backdrop-blur-xs">
          {FILTERS.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setFilter(entry)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === entry
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary dark:text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search saved items..."
            className="w-full h-10 pl-9 pr-8 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121422] text-xs text-ink dark:text-white placeholder:text-ink-tertiary dark:placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none transition-all shadow-2xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink dark:hover:text-white"
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
              className="group rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-5 hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-ink-secondary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.06] border border-black/[0.03] dark:border-white/[0.05]">
                    {TYPE_LABEL[item.type] || item.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromLibrary(item.id)}
                    title={`Remove ${item.name}`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-ink-tertiary hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <Preview item={item} />

                <div className="mt-3.5">
                  <h2 className="text-sm font-semibold text-ink group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors truncate" title={item.name}>
                    {item.name}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-mono text-ink-tertiary dark:text-slate-400">
                    Saved {formatDate(item.savedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setItemToAdd(item)}
                  className="w-full py-2 px-3 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-[#F8FAFC] dark:bg-white/[0.04] hover:bg-[#111827] dark:hover:bg-[#8B5CF6] hover:text-white dark:hover:text-white hover:border-transparent text-ink text-xs font-medium transition-all flex items-center justify-center gap-1.5 group/btn shadow-none hover:shadow-sm"
                >
                  <Plus size={13} className="text-ink dark:text-white group-hover/btn:text-white transition-colors" />
                  <span>Add to project</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-border-subtle bg-white/60 dark:bg-[#0E1018]/50 p-16 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-stone-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-tertiary dark:text-slate-400 mb-3 shadow-sm">
            <FolderOpen size={20} />
          </div>
          <h2 className="text-sm font-semibold text-ink">
            {library.length ? "No matching saved items" : "Your creative library is waiting"}
          </h2>
          <p className="mt-1 text-xs text-ink-secondary dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {library.length
              ? "Try adjusting your category filter or search query."
              : "Discover inspiration in Explore or save elements from your canvas to build your persistent memory."}
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full bg-ink dark:bg-[#8B5CF6] text-white text-xs font-medium hover:bg-[#1E1B4B] dark:hover:bg-[#7C3AED] transition-colors shadow-sm"
          >
            <Sparkles size={13} />
            <span>Browse Explore</span>
          </Link>
        </div>
      )}
      </>
      )}

      {/* ── Add to Project Modal ───────────────────────────────────────── */}
      {itemToAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E1018] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="text-sm font-semibold text-ink">Place on Canvas</h3>
                <p className="text-xs text-ink-secondary dark:text-slate-400 mt-0.5">
                  Select a brand workspace for <strong className="text-ink">{itemToAdd.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setItemToAdd(null)}
                className="text-ink-tertiary hover:text-ink dark:hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-3 max-h-64 overflow-y-auto space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => addToProject(project.id)}
                  className="w-full p-3 rounded-xl flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors border border-transparent hover:border-black/[0.04] dark:hover:border-white/[0.08]"
                >
                  <div>
                    <p className="text-xs font-semibold text-ink">{project.name}</p>
                    <p className="text-[11px] text-ink-tertiary dark:text-slate-400">{project.client} · {project.type}</p>
                  </div>
                  <span className="text-xs font-mono text-[#8B5CF6]">Add →</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setItemToAdd(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

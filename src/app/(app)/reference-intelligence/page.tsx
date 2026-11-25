"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  Sparkles,
  Droplets,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Bookmark,
  Check,
  Search,
  Filter,
  Compass,
  Zap,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject, LibraryItem } from "@/lib/data";
import { analyzeReference } from "@/lib/intelligence/ai-engine";
import type { ReferenceIntelligenceReport } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";

export default function ReferenceIntelligencePage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects, library, saveToLibrary, addInspirationToCanvas } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  // Pull all references from Library and project canvas
  const allReferences = React.useMemo(() => {
    const list: any[] = [];
    // Library references
    library
      .filter((i) => i.type === "reference" || i.type === "palette" || i.imageUrl)
      .forEach((item) => {
        list.push({
          id: item.id,
          title: item.name,
          imageUrl: item.imageUrl || item.content?.url || item.content?.imageUrl,
          source: item.source || "Library Collection",
          metadata: item.content?.metadata || item.content,
        });
      });

    // Project canvas references
    if (selectedProject?.canvasObjects) {
      selectedProject.canvasObjects
        .filter((o) => o.type === "image" || o.type === "reference")
        .forEach((obj) => {
          if (!list.some((existing) => existing.id === obj.id)) {
            list.push({
              id: obj.id,
              title: obj.content?.title || obj.content?.name || "Canvas Asset",
              imageUrl: obj.content?.url || obj.content?.imageUrl,
              source: `${selectedProject.name} Canvas`,
              metadata: obj.content,
            });
          }
        });
    }

    // Curated fallbacks if user hasn't added references yet
    if (list.length === 0) {
      list.push(
        {
          id: "curated-1",
          title: "Architectural Identity Monograph",
          imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          source: "Studio Archive",
          metadata: { hex: "#1A1B26" },
        },
        {
          id: "curated-2",
          title: "Minimal Editorial Packaging System",
          imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
          source: "Brand Direction Feed",
          metadata: { hex: "#8B5CF6" },
        },
        {
          id: "curated-3",
          title: "Brutalist Swiss Exhibition Poster",
          imageUrl: "https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80",
          source: "Design Index",
          metadata: { hex: "#38BDF8" },
        }
      );
    }
    return list;
  }, [library, selectedProject]);

  const [activeReference, setActiveReference] = useState<any>(allReferences[0] || null);
  const [intelReport, setIntelReport] = useState<ReferenceIntelligenceReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (activeReference) {
      setIsAnalyzing(true);
      analyzeReference(activeReference, selectedProject || undefined)
        .then((report) => {
          setIntelReport(report);
          setIsAnalyzing(false);
        })
        .catch(() => setIsAnalyzing(false));
    }
  }, [activeReference, selectedProject]);

  const notifyAction = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleExtractColors = () => {
    if (!intelReport) return;
    saveToLibrary({
      type: "palette",
      name: `${intelReport.referenceTitle} (Extracted Palette)`,
      notes: "Extracted via Reference Intelligence",
      content: {
        colors: intelReport.observedData.dominantColors.map((c) => ({
          hex: c.hex,
          label: c.name,
        })),
      },
    });
    notifyAction("Palette extracted and saved to Library");
  };

  const handleAddToCanvas = () => {
    if (!activeReference || !selectedProject) return;
    addInspirationToCanvas(selectedProject.id, {
      id: activeReference.id,
      title: activeReference.title,
      type: "reference",
      imageUrl: activeReference.imageUrl,
      creator: activeReference.source,
    });
    notifyAction(`Added to "${selectedProject.name}" canvas`);
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <ProjectSelectorHeader
        badge="Asset Intelligence"
        badgeIcon={<Eye size={13} className="text-[#8B5CF6]" />}
        title="Reference Intelligence"
        description="Deep computer-vision and structural breakdown of design references, extracting exact palettes, grid systems, and strategic creative applications."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {/* Feedback Toast */}
      {actionSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check size={14} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main Grid: Reference Selector Sidebar + Deep Intelligence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: References Carousel / List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-ink-tertiary px-1">
            <span>Available References ({allReferences.length})</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {allReferences.map((ref) => {
              const isActive = activeReference?.id === ref.id;
              return (
                <div
                  key={ref.id}
                  onClick={() => setActiveReference(ref)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group ${
                    isActive
                      ? "bg-white dark:bg-[#1E2235] border-[#8B5CF6] shadow-[0_4px_16px_rgba(139,92,246,0.15)] ring-1 ring-[#8B5CF6]"
                      : "bg-white/70 dark:bg-[#0E1018]/70 border-black/[0.06] dark:border-white/[0.08] hover:border-[#8B5CF6]/40"
                  }`}
                >
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-white/10 shrink-0 border border-black/5 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ref.imageUrl}
                      alt={ref.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-ink truncate group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
                      {ref.title}
                    </h4>
                    <p className="text-[11px] font-mono text-ink-tertiary dark:text-slate-400 truncate mt-0.5">
                      {ref.source}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deep Intelligence Report (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {!intelReport || isAnalyzing ? (
            <div className="p-16 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 text-center space-y-3">
              <Zap size={24} className="mx-auto text-[#8B5CF6] animate-pulse" />
              <h3 className="text-sm font-semibold text-ink">Analyzing Reference Data…</h3>
              <p className="text-xs text-ink-secondary dark:text-slate-400">
                Extracting color distributions, composition ratios, and typographic characteristics.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header preview & quick action row */}
              <div className="p-6 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-white/10 border border-black/10 dark:border-white/20 shrink-0 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={intelReport.imageUrl}
                      alt={intelReport.referenceTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D28D9] dark:text-[#C4B5FD] px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-500/30">
                      {intelReport.aiInterpretations.designStyle}
                    </span>
                    <h3 className="text-lg font-bold text-ink">{intelReport.referenceTitle}</h3>
                    <p className="text-xs text-ink-tertiary dark:text-slate-400 font-mono">
                      {intelReport.source} · {intelReport.observedData.aspectRatio}
                    </p>
                  </div>
                </div>

                {/* Intelligence Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleExtractColors}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-stone-50 dark:bg-white/[0.04] text-xs font-medium text-ink hover:border-[#8B5CF6]/50 transition-colors cursor-pointer"
                  >
                    <Droplets size={12} className="text-[#8B5CF6]" />
                    <span>Extract Colors</span>
                  </button>

                  {selectedProject && (
                    <button
                      type="button"
                      onClick={handleAddToCanvas}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white text-xs font-medium hover:bg-black dark:hover:bg-[#7C3AED] transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus size={12} />
                      <span>Add to Canvas</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECTION A: OBSERVED DATA (Distinguished from interpretations) */}
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h4 className="text-sm font-semibold text-ink">Observed Visual Data</h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    100% Grounded Computer Vision
                  </span>
                </div>

                {/* Color Spectrum */}
                <div className="space-y-2">
                  <p className="text-xs font-mono text-ink-tertiary uppercase">Extracted Palette Spectrum</p>
                  <div className="grid grid-cols-3 gap-3">
                    {intelReport.observedData.dominantColors.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3"
                      >
                        <div
                          className="h-8 w-8 rounded-lg border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-ink truncate">{c.name}</p>
                          <p className="text-[10px] font-mono text-ink-tertiary">{c.hex} ({c.percentage}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Composition & Surface */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Spatial Composition</span>
                    <p className="font-medium text-ink">{intelReport.observedData.visualComposition}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Surface & Texture</span>
                    <p className="font-medium text-ink">{intelReport.observedData.textureStyle}</p>
                  </div>
                </div>
              </div>

              {/* SECTION B: AI STRATEGIC RECOMMENDATIONS (Distinguished from observed) */}
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#8B5CF6]" />
                    <h4 className="text-sm font-semibold text-ink">AI Strategic Interpretations</h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#8B5CF6] bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-500/20">
                    Creative Rationale
                  </span>
                </div>

                {/* Mood Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {intelReport.aiInterpretations.moodTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-stone-100 dark:bg-white/[0.04] text-ink border border-black/[0.04] dark:border-white/[0.06]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Creative Applications */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-mono text-ink-tertiary uppercase">Possible Creative Applications</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {intelReport.aiInterpretations.creativeApplications.map((app, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] flex items-center gap-2 text-ink font-medium"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

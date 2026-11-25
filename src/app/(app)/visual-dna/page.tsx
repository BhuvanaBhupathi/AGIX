"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dna,
  Sparkles,
  Layers,
  Palette,
  Type,
  Maximize2,
  Compass,
  Check,
  Bookmark,
  Share2,
  ShieldCheck,
  Eye,
  Info,
  RefreshCw,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { generateVisualDNA } from "@/lib/intelligence/ai-engine";
import type { VisualDNAReport } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";

export default function VisualDNAPage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects, saveToLibrary } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  const [dnaReport, setDnaReport] = useState<VisualDNAReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "colors" | "typography" | "shapes" | "composition" | "mood">("overview");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      generateVisualDNA(selectedProject)
        .then((report) => {
          setDnaReport(report);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedProject]);

  const handleSaveDirection = () => {
    if (!dnaReport || !selectedProject) return;
    saveToLibrary({
      type: "direction",
      name: `${selectedProject.name} — Visual DNA Direction`,
      notes: dnaReport.overview,
      content: {
        dnaId: dnaReport.id,
        colorDNA: dnaReport.colorDNA,
        typographyDNA: dnaReport.typographyDNA,
        shapeDNA: dnaReport.shapeDNA,
        compositionDNA: dnaReport.compositionDNA,
        moodDNA: dnaReport.moodDNA,
        reusableTokens: dnaReport.reusableTokens,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header with Project Selector */}
      <ProjectSelectorHeader
        badge="Visual Intelligence"
        badgeIcon={<Dna size={13} className="text-[#8B5CF6]" />}
        title="Visual DNA Engine"
        description="Comprehensive visual intelligence synthesizing colors, typography, geometry, and composition patterns across all project references."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
        actions={
          <button
            type="button"
            onClick={handleSaveDirection}
            disabled={!dnaReport || isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] text-white text-xs font-medium hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check size={13} className="text-emerald-300" />
                <span>Saved to Library</span>
              </>
            ) : (
              <>
                <Bookmark size={13} />
                <span>Save Creative Direction</span>
              </>
            )}
          </button>
        }
      />

      {/* Main Content State */}
      {!selectedProject ? (
        <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-12 text-center">
          <Dna size={32} className="mx-auto text-ink-tertiary mb-3 animate-pulse" />
          <h2 className="text-base font-semibold text-ink">No Brand Projects Found</h2>
          <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create or select a brand project to generate and extract its collective Visual DNA.
          </p>
        </div>
      ) : isLoading || !dnaReport ? (
        <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-16 text-center space-y-3">
          <RefreshCw size={24} className="mx-auto text-[#8B5CF6] animate-spin" />
          <h2 className="text-sm font-semibold text-ink">Synthesizing Visual DNA…</h2>
          <p className="text-xs text-ink-secondary dark:text-slate-400">
            Analyzing dominant color distributions, letterform geometry, and spatial grids across {selectedProject.name}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Hero Card */}
          <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#8B5CF6]/10 via-[#38BDF8]/5 to-transparent rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6D28D9] dark:text-[#C4B5FD] px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-500/30">
                    Aesthetic Archetype: {dnaReport.moodDNA.aestheticArchetype}
                  </span>
                  <span className="text-[10px] font-mono text-ink-tertiary dark:text-slate-400 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.04]">
                    {dnaReport.observedAssetCount} Source Assets Analyzed
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                  {dnaReport.reusableTokens.name}
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
                  {dnaReport.overview}
                </p>
              </div>

              {/* Fast Visual Fingerprint Swatch */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#121422] border border-black/[0.05] dark:border-white/[0.08] space-y-3 min-w-[220px]">
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary dark:text-slate-400">
                  <span>Color Harmony</span>
                  <span className="text-[#8B5CF6] font-medium">{dnaReport.colorDNA.harmonyType}</span>
                </div>
                <div className="flex h-7 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner">
                  {dnaReport.colorDNA.dominant.map((c, i) => (
                    <div
                      key={i}
                      style={{ width: `${c.percentage}%`, background: c.hex }}
                      title={`${c.name} (${c.hex}) — ${c.percentage}%`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary dark:text-slate-400">
                  <span>Contrast Ratio</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {dnaReport.colorDNA.contrastRatio}:1 (WCAG AA)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA Section Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs backdrop-blur-xs overflow-x-auto">
            {(
              [
                { id: "overview", label: "Overview & Characteristics" },
                { id: "colors", label: "Color DNA" },
                { id: "typography", label: "Typography DNA" },
                { id: "shapes", label: "Shape DNA" },
                { id: "composition", label: "Composition DNA" },
                { id: "mood", label: "Mood DNA" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-xs ${
                  activeTab === t.id
                    ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                    : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: OVERVIEW & KEY CHARACTERISTICS ───────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Characteristics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dnaReport.keyCharacteristics.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          item.type === "observed"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30"
                            : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/30"
                        }`}
                      >
                        {item.type === "observed" ? "• Observed Image Data" : "✨ AI Interpretation"}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-ink">{item.title}</h4>
                    <p className="text-xs text-ink-secondary dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hierarchy Blueprint */}
              <div className="p-6 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-[#8B5CF6]" />
                  <h4 className="text-sm font-semibold text-ink">Visual Hierarchy & Depth Structure</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Primary Anchor</span>
                    <p className="font-medium text-ink">{dnaReport.visualHierarchy.dominantElement}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Secondary Flow</span>
                    <p className="font-medium text-ink">{dnaReport.visualHierarchy.secondaryFlow}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Layering & Ground</span>
                    <p className="font-medium text-ink">{dnaReport.visualHierarchy.backgroundLayering}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: COLOR DNA ───────────────────────────────────────────── */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Observed Image Swatches
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-ink mt-1">Chromatic Distribution & Hierarchy</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-ink-tertiary">
                    <span>Palette Mood:</span>
                    <span className="text-ink font-semibold">{dnaReport.colorDNA.paletteMood}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dnaReport.colorDNA.dominant.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-stone-50 dark:bg-[#121422] flex items-center gap-4"
                    >
                      <div
                        className="h-14 w-14 rounded-xl border border-black/10 dark:border-white/20 shrink-0 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#8B5CF6] uppercase">{c.role}</span>
                          <span className="text-xs font-mono font-semibold text-ink">{c.percentage}%</span>
                        </div>
                        <p className="text-xs font-semibold text-ink truncate mt-0.5">{c.name}</p>
                        <p className="text-[11px] font-mono text-ink-tertiary">{c.hex.toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: TYPOGRAPHY DNA ──────────────────────────────────────── */}
          {activeTab === "typography" && (
            <div className="space-y-6">
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-500/20">
                      Letterform Architecture
                    </span>
                    <h4 className="text-base font-semibold text-ink mt-1">
                      Classification: {dnaReport.typographyDNA.primaryClassification}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-ink-tertiary">
                    Contrast: <strong className="text-ink">{dnaReport.typographyDNA.contrastLevel}</strong>
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] space-y-4">
                  <p className="text-xs font-mono uppercase text-ink-tertiary">Specimen Rhythm</p>
                  <p className="text-2xl sm:text-3xl font-normal text-ink tracking-tight">
                    Sphinx of black quartz, judge my vow.
                  </p>
                  <p className="text-xs text-ink-secondary dark:text-slate-400 leading-relaxed">
                    {dnaReport.typographyDNA.weightRhythm}
                  </p>
                </div>

                {/* Suggested Pairings */}
                <div className="space-y-3">
                  <h5 className="text-xs font-mono uppercase text-ink-tertiary">Calibrated Typographic Pairings</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dnaReport.typographyDNA.suggestedPairings.map((pair, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018] space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ink">{pair.heading}</span>
                          <span className="text-ink-tertiary">+</span>
                          <span className="font-mono text-ink-secondary">{pair.body}</span>
                        </div>
                        <p className="text-[11px] text-ink-secondary dark:text-slate-400">{pair.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: SHAPE DNA ───────────────────────────────────────────── */}
          {activeTab === "shapes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">Geometry Language</span>
                <h4 className="text-base font-semibold text-ink">{dnaReport.shapeDNA.shapeLanguage}</h4>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1 text-xs">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Corner & Edge Philosophy</p>
                  <p className="text-ink font-medium">{dnaReport.shapeDNA.cornerTreatment}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1 text-xs">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Silhouette Density</p>
                  <p className="text-ink font-medium">{dnaReport.shapeDNA.density}</p>
                </div>
              </div>

              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">Recurring Motifs</span>
                <ul className="space-y-2 text-xs">
                  {dnaReport.shapeDNA.recurringMotifs.map((motif, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] flex items-center gap-2.5 text-ink font-medium"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
                      <span>{motif}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── TAB 5: COMPOSITION DNA ─────────────────────────────────────── */}
          {activeTab === "composition" && (
            <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">Spatial Physics</span>
                <h4 className="text-base font-semibold text-ink mt-1">Grid Architecture: {dnaReport.compositionDNA.gridSystem}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Negative Space Allocation</p>
                  <p className="font-medium text-ink">{dnaReport.compositionDNA.negativeSpaceRatio}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Focal Distribution</p>
                  <p className="font-medium text-ink">{dnaReport.compositionDNA.focalDistribution}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Balance Axis</p>
                  <p className="font-medium text-ink">{dnaReport.compositionDNA.balance}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: MOOD DNA ────────────────────────────────────────────── */}
          {activeTab === "mood" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">Atmospheric Tone</span>
                <h4 className="text-xl font-bold text-ink">{dnaReport.moodDNA.primaryMood}</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {dnaReport.moodDNA.secondaryMoods.map((m, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6]">Sensory Temperature</span>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Chromatic Temperature</p>
                  <p className="font-semibold text-ink">{dnaReport.moodDNA.temperature}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                  <p className="font-mono text-[10px] text-ink-tertiary uppercase">Energy Intensity</p>
                  <p className="font-semibold text-ink">{dnaReport.moodDNA.energyLevel}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

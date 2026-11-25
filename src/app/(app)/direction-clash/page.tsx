"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Columns2,
  Sparkles,
  Check,
  Bookmark,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target,
  ShieldAlert,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { compareDirections } from "@/lib/intelligence/ai-engine";
import type { DirectionClashReport } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";

export default function DirectionClashPage() {
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

  const [clashReport, setClashReport] = useState<DirectionClashReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("dir-a");
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      compareDirections(selectedProject, ["dir-a", "dir-b"])
        .then((report) => {
          setClashReport(report);
          setSelectedWinnerId(report.recommendation.recommendedDirectionId);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedProject]);

  const handleAdoptDirection = (dirId: string) => {
    setSelectedWinnerId(dirId);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <ProjectSelectorHeader
        badge="Strategic Decision"
        badgeIcon={<Columns2 size={13} className="text-[#8B5CF6]" />}
        title="Direction Clash"
        description="Simultaneous multi-direction visual comparison environment evaluating palette, typography, audience fit, and market differentiation."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {saveToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check size={14} />
          <span>Primary creative direction updated and locked for presentation!</span>
        </div>
      )}

      {!selectedProject || !clashReport || isLoading ? (
        <div className="p-16 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 text-center space-y-3">
          <Columns2 size={28} className="mx-auto text-[#8B5CF6] animate-pulse" />
          <h3 className="text-sm font-semibold text-ink">Analyzing Competing Creative Directions…</h3>
          <p className="text-xs text-ink-secondary dark:text-slate-400">
            Evaluating positioning compatibility, typography contrasts, and audience resonance.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Side-by-Side Direction Cards (2 to 4 directions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {clashReport.directions.map((dir) => {
              const isSelected = selectedWinnerId === dir.id;
              const isRecommended = clashReport.recommendation.recommendedDirectionId === dir.id;

              return (
                <div
                  key={dir.id}
                  className={`rounded-[26px] p-6 sm:p-7 border transition-all flex flex-col justify-between space-y-6 ${
                    isSelected
                      ? "bg-white dark:bg-[#0E1018] border-[#8B5CF6] shadow-[0_8px_32px_rgba(139,92,246,0.2)] ring-1 ring-[#8B5CF6]"
                      : "bg-white/80 dark:bg-[#0E1018]/70 border-black/[0.06] dark:border-white/[0.08]"
                  }`}
                >
                  <div className="space-y-5">
                    {/* Direction Title Bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {isRecommended && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-500/30 mb-2 inline-block">
                            ★ Recommended by Strategy
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-ink">{dir.name}</h3>
                        <p className="text-xs text-ink-secondary dark:text-slate-400 mt-0.5 font-mono">{dir.mood}</p>
                      </div>

                      {isSelected && (
                        <span className="h-6 w-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-sm shrink-0">
                          <Check size={14} />
                        </span>
                      )}
                    </div>

                    {/* Palette Swatches Bar */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-ink-tertiary uppercase">Palette DNA</span>
                      <div className="flex h-10 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner">
                        {dir.palette.map((hex, i) => (
                          <div
                            key={i}
                            className="flex-1 h-full flex items-end p-1.5"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          >
                            <span className="text-[9px] font-mono px-1 rounded bg-black/50 text-white backdrop-blur-xs">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography Specimen */}
                    <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-ink-tertiary uppercase">Typography Hierarchy</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-ink">{dir.fonts.heading}</span>
                        <span className="text-xs font-mono text-ink-secondary">Body: {dir.fonts.body}</span>
                      </div>
                    </div>

                    {/* Compatibility Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                        <div className="flex items-center justify-between text-ink-tertiary font-mono text-[10px]">
                          <span>Audience Fit</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{dir.targetAudienceFit}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dir.targetAudienceFit}%` }} />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                        <div className="flex items-center justify-between text-ink-tertiary font-mono text-[10px]">
                          <span>Positioning Fit</span>
                          <span className="text-[#8B5CF6] font-bold">{dir.positioningFit}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${dir.positioningFit}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Strengths:</span>
                        <ul className="space-y-1">
                          {dir.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-ink-secondary dark:text-slate-300">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-semibold">Considerations & Risks:</span>
                        <ul className="space-y-1">
                          {dir.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-ink-secondary dark:text-slate-300">
                              <span className="text-amber-500 font-bold">⚠</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Select Direction Button */}
                  <button
                    type="button"
                    onClick={() => handleAdoptDirection(dir.id)}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#191918] dark:bg-[#8B5CF6] text-white shadow-sm"
                        : "border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-white/[0.04] text-ink hover:border-[#8B5CF6]/50"
                    }`}
                  >
                    {isSelected ? "Selected as Primary Direction" : "Select this Direction"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* AI Strategic Synthesis & Synthesis Table */}
          <div className="p-6 sm:p-8 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#8B5CF6]" />
              <h4 className="text-base font-bold text-ink">AI Synthesis & Strategic Recommendation</h4>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-500/20 space-y-2">
              <span className="text-xs font-semibold text-[#6D28D9] dark:text-[#C4B5FD]">
                Strategic Verdict: Adopt {clashReport.recommendation.recommendedDirectionName}
              </span>
              <p className="text-xs sm:text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
                {clashReport.recommendation.rationale}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-2">
                <span className="font-mono text-[10px] text-ink-tertiary uppercase">Core Similarities</span>
                <ul className="space-y-1.5 text-ink-secondary dark:text-slate-400">
                  {clashReport.similarities.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-2">
                <span className="font-mono text-[10px] text-ink-tertiary uppercase">Divergent Elements</span>
                <ul className="space-y-1.5 text-ink-secondary dark:text-slate-400">
                  {clashReport.differences.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-2">
                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 uppercase">Conflict Avoidance</span>
                <ul className="space-y-1.5 text-ink-secondary dark:text-slate-400">
                  {clashReport.inconsistencies.map((item, i) => (
                    <li key={i}>⚠ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

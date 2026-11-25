"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Check,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { runBrandCoherenceCheck } from "@/lib/intelligence/ai-engine";
import type { BrandCoherenceReport } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";

export default function BrandCoherencePage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  const [coherenceReport, setCoherenceReport] = useState<BrandCoherenceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "criteria" | "conflicts">("overview");

  useEffect(() => {
    if (selectedProject) {
      setIsLoading(true);
      runBrandCoherenceCheck(selectedProject)
        .then((report) => {
          setCoherenceReport(report);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedProject]);

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <ProjectSelectorHeader
        badge="Quality & Consistency"
        badgeIcon={<ShieldCheck size={13} className="text-[#8B5CF6]" />}
        title="Brand Coherence Engine"
        description="Comprehensive brand consistency checker validating chromatic harmony, typographic balance, and Brand Brain positioning alignment using explainable metrics."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {!selectedProject || !coherenceReport || isLoading ? (
        <div className="p-16 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 text-center space-y-3">
          <RefreshCw size={24} className="mx-auto text-[#8B5CF6] animate-spin" />
          <h3 className="text-sm font-semibold text-ink">Running Brand Coherence Analysis…</h3>
          <p className="text-xs text-ink-secondary dark:text-slate-400">
            Checking WCAG relative luminance, optical font pairings, and brand personality integrity.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Score Banner Card */}
          <div className="p-6 sm:p-8 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#38BDF8] text-white flex flex-col items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                <span className="text-2xl font-black">{coherenceReport.overallScore}%</span>
                <span className="text-[10px] font-mono tracking-wider uppercase opacity-85">Score</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Grade: {coherenceReport.grade}
                  </span>
                  <span className="text-xs font-mono text-ink-tertiary">
                    {coherenceReport.conflicts.length} Noticeable Conflicts
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink">Brand Identity Alignment Rating</h3>
                <p className="text-xs text-ink-secondary dark:text-slate-400 max-w-lg">
                  Every sub-score is computed through explainable mathematical criteria (contrast ratio, scale balance, trait harmony) rather than arbitrary generation.
                </p>
              </div>
            </div>

            {/* 4 Category Pill Bars */}
            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-ink-tertiary">
                  <span>Color Balance</span>
                  <span className="text-ink font-semibold">{coherenceReport.categoryScores.colorConsistency}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${coherenceReport.categoryScores.colorConsistency}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-ink-tertiary">
                  <span>Typography</span>
                  <span className="text-ink font-semibold">{coherenceReport.categoryScores.typographyConsistency}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${coherenceReport.categoryScores.typographyConsistency}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-ink-tertiary">
                  <span>Visual Rigor</span>
                  <span className="text-ink font-semibold">{coherenceReport.categoryScores.visualConsistency}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${coherenceReport.categoryScores.visualConsistency}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#121422] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-ink-tertiary">
                  <span>Personality</span>
                  <span className="text-ink font-semibold">{coherenceReport.categoryScores.personalityAlignment}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${coherenceReport.categoryScores.personalityAlignment}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs backdrop-blur-xs w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all text-xs ${
                activeTab === "overview"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-sm font-semibold border border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/50"
              }`}
            >
              Actionable Fixes ({coherenceReport.actionableSuggestions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("conflicts")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all text-xs ${
                activeTab === "conflicts"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-sm font-semibold border border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/50"
              }`}
            >
              Identified Conflicts ({coherenceReport.conflicts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("criteria")}
              className={`px-4 py-1.5 rounded-full font-medium transition-all text-xs ${
                activeTab === "criteria"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-sm font-semibold border border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/50"
              }`}
            >
              Explainable Criteria Breakdown
            </button>
          </div>

          {/* TAB 1: ACTIONABLE SUGGESTIONS */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coherenceReport.actionableSuggestions.map((sug, i) => (
                <div
                  key={i}
                  className="p-5 rounded-[22px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-2.5 shadow-2xs"
                >
                  <span
                    className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                      sug.impact === "High Impact"
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60"
                        : "bg-stone-100 dark:bg-white/[0.06] text-ink-secondary"
                    }`}
                  >
                    {sug.impact}
                  </span>
                  <h4 className="text-sm font-semibold text-ink">{sug.title}</h4>
                  <p className="text-xs text-ink-secondary dark:text-slate-400 leading-relaxed">
                    {sug.action}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CONFLICTS */}
          {activeTab === "conflicts" && (
            <div className="space-y-3">
              {coherenceReport.conflicts.map((conf) => (
                <div
                  key={conf.id}
                  className="p-5 rounded-[22px] border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-500" />
                      <span className="font-semibold text-ink text-sm">{conf.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-600 uppercase bg-amber-100/60 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
                      {conf.severity} severity · {conf.category}
                    </span>
                  </div>
                  <p className="text-ink-secondary dark:text-slate-300 leading-relaxed">{conf.description}</p>
                  <div className="pt-1 flex items-center gap-1.5 text-ink-tertiary">
                    <span className="font-mono text-[10px]">Fix:</span>
                    <span className="text-ink font-medium">{conf.suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EXPLAINABLE CRITERIA */}
          {activeTab === "criteria" && (
            <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4">
              <h4 className="text-sm font-bold text-ink">Explainable Calculation Formulas</h4>
              <div className="divide-y divide-stone-100 dark:divide-white/[0.04]">
                {coherenceReport.criteriaBreakdown.map((crit, idx) => (
                  <div key={idx} className="py-4 space-y-1 text-xs first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink text-sm">{crit.name}</span>
                      <span className="font-mono font-bold text-[#8B5CF6]">{crit.score}% (Weight: {crit.weight}%)</span>
                    </div>
                    <p className="text-ink-secondary dark:text-slate-400">{crit.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

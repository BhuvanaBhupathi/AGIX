"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wand2,
  Sparkles,
  Check,
  X,
  Plus,
  Bookmark,
  SlidersHorizontal,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { generateCreativeAlternatives } from "@/lib/intelligence/ai-engine";
import type { CreativeAlternativeBatch, AlternativePreset } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";

const PRESET_OPTIONS: { id: AlternativePreset; label: string; description: string }[] = [
  { id: "more_minimal", label: "Make it more minimal", description: "Expands negative space & strips decorative elements" },
  { id: "more_luxurious", label: "Make it more luxurious", description: "Champagne/gold undertones with high-contrast serif typography" },
  { id: "more_experimental", label: "Make it more experimental", description: "Neo-brutalist kinetic shifts with bold accent pops" },
  { id: "warmer", label: "Make it warmer", description: "Earthen terracotta and cream tones with softer curvature" },
  { id: "more_futuristic", label: "Make it more futuristic", description: "Aerodynamic cyan laser glows with technical carbon fields" },
  { id: "more_editorial", label: "Make it more editorial", description: "Couture monograph pagination and editorial serif headlines" },
  { id: "more_professional", label: "Make it more professional", description: "Institutional enterprise blue with high-contrast structural grid" },
];

export default function CreativeAlternativesPage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects, saveToLibrary, addInspirationToCanvas } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  const [activePreset, setActivePreset] = useState<AlternativePreset>("more_minimal");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<CreativeAlternativeBatch | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleGenerate = async (presetToUse = activePreset) => {
    if (!selectedProject || isGenerating) return;
    setIsGenerating(true);
    try {
      const batch = await generateCreativeAlternatives(
        selectedProject,
        { name: selectedProject.name },
        presetToUse,
        presetToUse === "custom" ? customPrompt : undefined
      );
      setCurrentBatch(batch);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate on first mount if project exists
  React.useEffect(() => {
    if (selectedProject && !currentBatch) {
      handleGenerate("more_minimal");
    }
  }, [selectedProject]);

  const handleSaveToLibrary = (alt: any) => {
    saveToLibrary({
      type: "direction",
      name: `${alt.title} (Alternative)`,
      notes: alt.rationale,
      content: {
        palette: alt.palette,
        typography: alt.typography,
        personalityShift: alt.personalityShift,
      },
    });
    notify(`Saved "${alt.title}" to Library`);
  };

  const handleApplyToCanvas = (alt: any) => {
    if (!selectedProject) return;
    addInspirationToCanvas(selectedProject.id, {
      id: alt.id,
      title: alt.title,
      type: "direction",
      metadata: {
        palette: alt.palette,
        fontSpecimen: alt.typography.heading,
        secondaryFont: alt.typography.body,
        description: alt.visualShift,
      },
    });
    notify(`Added "${alt.title}" to Canvas`);
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <ProjectSelectorHeader
        badge="Exploration Engine"
        badgeIcon={<Wand2 size={13} className="text-[#8B5CF6]" />}
        title="Creative Alternatives"
        description="Generate multiple divergent creative variations and stylistic evolutions without ever overwriting your original brand assets."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check size={14} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Instruction Controller Bar */}
      <div className="p-6 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-ink-tertiary">Select Stylistic Shift Instruction:</span>
          <span className="text-[10px] font-mono text-[#8B5CF6]">Non-destructive generation</span>
        </div>

        {/* Preset Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setActivePreset(opt.id);
                handleGenerate(opt.id);
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activePreset === opt.id
                  ? "bg-[#191918] dark:bg-[#8B5CF6] text-white shadow-sm"
                  : "bg-stone-100 dark:bg-white/[0.04] text-ink hover:border-[#8B5CF6]/50 border border-transparent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom instruction prompt */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Or type custom instructions: e.g. 'Make it feel like a Swiss pharmaceutical identity from 1974'..."
            className="flex-1 h-10 px-4 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-stone-50 dark:bg-[#121422] text-xs text-ink outline-none focus:border-[#8B5CF6]"
          />
          <button
            type="button"
            onClick={() => {
              setActivePreset("custom");
              handleGenerate("custom");
            }}
            disabled={!customPrompt.trim() || isGenerating}
            className="px-5 h-10 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white text-xs font-medium hover:bg-black dark:hover:bg-[#7C3AED] transition-all disabled:opacity-40 cursor-pointer"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Alternatives Grid */}
      {isGenerating ? (
        <div className="p-16 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 text-center space-y-3">
          <RefreshCw size={24} className="mx-auto text-[#8B5CF6] animate-spin" />
          <h3 className="text-sm font-semibold text-ink">Synthesizing Creative Alternatives…</h3>
          <p className="text-xs text-ink-secondary dark:text-slate-400">
            Applying stylistic constraints while preserving brand recognition.
          </p>
        </div>
      ) : currentBatch?.alternatives && currentBatch.alternatives.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-ink-tertiary px-1">
            <span>Generated Alternatives ({currentBatch.alternatives.length})</span>
            <span>Target: {currentBatch.originalName}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentBatch.alternatives.map((alt) => (
              <div
                key={alt.id}
                className="p-6 rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-5 flex flex-col justify-between shadow-2xs hover:border-[#8B5CF6]/40 transition-all"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8B5CF6] bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      {alt.personalityShift}
                    </span>
                    <h3 className="text-base font-bold text-ink mt-2">{alt.title}</h3>
                    <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1 leading-relaxed">
                      {alt.rationale}
                    </p>
                  </div>

                  {/* Palette preview */}
                  {alt.palette && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-ink-tertiary uppercase">Adjusted Palette</span>
                      <div className="flex h-8 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-inner">
                        {alt.palette.map((hex, i) => (
                          <div key={i} className="flex-1 h-full" style={{ backgroundColor: hex }} title={hex} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Typography preview */}
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#121422] border border-black/[0.04] dark:border-white/[0.06] text-xs space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Proposed Typography</span>
                    <p className="font-semibold text-ink">
                      {alt.typography.heading} <span className="font-normal text-ink-secondary">/ {alt.typography.body}</span>
                    </p>
                  </div>

                  {/* Key shifts */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-ink-tertiary uppercase">Key Tactical Changes</span>
                    <ul className="space-y-1 text-xs text-ink-secondary dark:text-slate-400">
                      {alt.keyChanges.map((change, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-[#8B5CF6]" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveToLibrary(alt)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:text-[#8B5CF6] transition-colors cursor-pointer"
                  >
                    <Bookmark size={13} />
                    <span>Save to Library</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyToCanvas(alt)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white text-xs font-semibold hover:bg-black dark:hover:bg-[#7C3AED] transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus size={13} />
                    <span>Add to Canvas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

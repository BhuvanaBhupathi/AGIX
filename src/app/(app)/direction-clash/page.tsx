"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  List,
  Upload,
  Download,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Hexagon,
  FolderOpen,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

interface DirectionConcept {
  id: string;
  number: string;
  name: string;
  headline: string;
  subheadline: string;
  theme: "light-sage" | "navy" | "terracotta" | "acid-lime";
  palette: string[];
  audienceFit: number;
  positioningFit: number;
  accentColor: string;
  bgPage: string;
  textPrimary: string;
  textSecondary: string;
}

export function DirectionClashView() {
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState<"gallery" | "overview" | "brand" | "assets">("gallery");
  const [selectedConceptId, setSelectedConceptId] = useState<string>("01");
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const concepts: DirectionConcept[] = [
    {
      id: "01",
      number: "01",
      name: "Concept 01 · Architectural Sage",
      headline: "Shaping a better tomorrow.",
      subheadline: "Sustainable thinking. Intelligent solutions. Meaningful impact.",
      theme: "light-sage",
      palette: ["#FFFFFF", "#8FA282", "#E4EADF", "#1D231A"],
      audienceFit: 94,
      positioningFit: 92,
      accentColor: "#6B845C",
      bgPage: "#FFFFFF",
      textPrimary: "#1D231A",
      textSecondary: "#636E5F",
    },
    {
      id: "02",
      number: "02",
      name: "Concept 02 · Midnight Monolith",
      headline: "Building smarter futures.",
      subheadline: "Strategy. Innovation. Sustainable growth.",
      theme: "navy",
      palette: ["#0C131F", "#1B2A44", "#38BDF8", "#F8FAFC"],
      audienceFit: 88,
      positioningFit: 96,
      accentColor: "#38BDF8",
      bgPage: "#0A101A",
      textPrimary: "#FFFFFF",
      textSecondary: "#8A99B0",
    },
    {
      id: "03",
      number: "03",
      name: "Concept 03 · Warm Terracotta",
      headline: "Purpose driven. Future focused.",
      subheadline: "Creating value today for generations tomorrow.",
      theme: "terracotta",
      palette: ["#FAF8F5", "#D97746", "#F3ECE4", "#2B1A12"],
      audienceFit: 91,
      positioningFit: 89,
      accentColor: "#D97746",
      bgPage: "#FBF9F6",
      textPrimary: "#2B1A12",
      textSecondary: "#7A6961",
    },
    {
      id: "04",
      number: "04",
      name: "Concept 04 · Kinetic Acid Lime",
      headline: "Bold ideas. Real impact.",
      subheadline: "We challenge convention to build what matters.",
      theme: "acid-lime",
      palette: ["#08090E", "#CCFF00", "#181B26", "#FFFFFF"],
      audienceFit: 97,
      positioningFit: 95,
      accentColor: "#CCFF00",
      bgPage: "#08090E",
      textPrimary: "#FFFFFF",
      textSecondary: "#9AA0B4",
    },
  ];

  const handleSelectWinner = (id: string) => {
    setSelectedConceptId(id);
    const selected = concepts.find((c) => c.id === id);
    setSavedToast(`Selected ${selected?.name} as Primary Brand Direction!`);
    setTimeout(() => setSavedToast(null), 3500);
  };

  return (
    <div className="relative space-y-6 max-w-7xl mx-auto">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Page Header (Standard AGIX Pattern) ───────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Layers size={12} />
            <span>Creative Decisions · Direction Clash</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Direction Clash
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            Compare multiple creative directions simultaneously across typography, mood, audience fit, and positioning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ink-tertiary">Active Winner:</span>
          <span className="px-3 py-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs font-mono font-bold text-ink">
            Concept {selectedConceptId}
          </span>
        </div>
      </header>

      {savedToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-2xl text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2 shadow-2xs animate-fade-in">
          <Check size={14} className="text-emerald-500" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ── Main Two-Pane Body (Merged with Web UI) ───────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar (w-full lg:w-64) */}
        <aside className="w-full lg:w-64 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-5 flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-6">
            {/* Diamond Mark & Brand Wordmark */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl border border-border-subtle bg-stone-100/70 dark:bg-white/[0.04] flex items-center justify-center text-ink">
                <div className="w-3.5 h-3.5 rotate-45 border-2 border-current" />
              </div>
              <div>
                <span className="font-extrabold tracking-widest text-xs text-ink uppercase block">
                  VERIDA
                </span>
                <span className="text-[10px] font-mono text-ink-tertiary">Studio Systems</span>
              </div>
            </div>

            {/* Title & Narrative */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary">
                BROCHURE CONCEPTS
              </span>
              <h2 className="text-base font-bold text-ink tracking-tight">
                Design Variations
              </h2>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Exploring distinct visual directions for the same brand story.
              </p>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "gallery"
                    ? "bg-ink text-paper font-semibold shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <LayoutGrid size={14} />
                <span>Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-ink text-paper font-semibold shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <Clock size={14} />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("brand")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "brand"
                    ? "bg-ink text-paper font-semibold shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <Hexagon size={14} />
                <span>Brand Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab("assets")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === "assets"
                    ? "bg-ink text-paper font-semibold shadow-xs"
                    : "text-ink-secondary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                <FolderOpen size={14} />
                <span>Assets</span>
              </button>
            </nav>
          </div>

          {/* Bottom Card: Brand Essence */}
          <div className="pt-4 border-t border-border-subtle space-y-3">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary block">
                Brand Essence
              </span>
              <p className="text-xs text-ink font-semibold">
                Innovate. Inspire. Impact.
              </p>
            </div>

            <button
              onClick={() => {
                setSavedToast("Exported all brochure variations PDF package!");
                setTimeout(() => setSavedToast(null), 3000);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100/80 dark:bg-white/[0.06] hover:bg-stone-200/80 dark:hover:bg-white/[0.1] border border-border-subtle text-ink text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <Download size={13} />
              <span>Download All</span>
            </button>
          </div>
        </aside>

        {/* Right Main Gallery (2x2 Grid of Open Brochure Mockups) */}
        <div className="flex-1 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-6 space-y-6 min-w-0">
          {/* Top Bar: "4 Concepts" and View Toggles */}
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <span className="text-xs font-bold text-ink block">4 Active Brochure Concepts</span>
              <span className="text-[11px] text-ink-tertiary font-mono">Side-by-side spread evaluation</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-stone-100/80 dark:bg-white/[0.04] p-0.5 rounded-xl border border-black/[0.04] dark:border-white/[0.08]">
                <button className="p-1.5 rounded-lg bg-white dark:bg-white/10 text-ink shadow-xs">
                  <LayoutGrid size={13} />
                </button>
                <button className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink">
                  <List size={13} />
                </button>
              </div>

              <button
                onClick={() => {
                  setSavedToast("Review link copied to clipboard!");
                  setTimeout(() => setSavedToast(null), 3000);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100/80 dark:bg-white/[0.04] hover:bg-stone-200 dark:hover:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.08] text-xs font-medium text-ink transition-colors"
              >
                <Share2 size={12} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* 2x2 Grid of Open Brochure Spreads */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {concepts.map((concept) => {
              const isSelected = selectedConceptId === concept.id;

              return (
                <div
                  key={concept.id}
                  onClick={() => handleSelectWinner(concept.id)}
                  className={`relative rounded-2xl p-5 bg-stone-50 dark:bg-[#121420] border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-subtle ${
                    isSelected
                      ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md"
                      : "border-border-subtle hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  {/* Top Row: Concept Number Badge & Fit Metric */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-ink">
                      {concept.number} · {concept.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-stone-200/70 dark:bg-white/[0.08] text-ink font-semibold">
                        {concept.audienceFit}% Audience Fit
                      </span>
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Open Booklet Spread Mockup */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden shadow-md flex border border-black/15">
                    {/* Left Page (Typography & Statement) */}
                    <div
                      className="w-1/2 p-5 flex flex-col justify-between relative border-r border-black/10"
                      style={{
                        backgroundColor: concept.bgPage,
                        color: concept.textPrimary,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rotate-45 border border-current" />
                        <span className="text-[8px] font-extrabold tracking-widest uppercase">
                          VERIDA
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm sm:text-base font-bold leading-tight tracking-tight">
                          {concept.headline}
                        </h3>
                        <p
                          className="text-[9px] leading-relaxed"
                          style={{ color: concept.textSecondary }}
                        >
                          {concept.subheadline}
                        </p>
                      </div>

                      <span
                        className="text-[8px] font-mono"
                        style={{ color: concept.textSecondary }}
                      >
                        verida.com
                      </span>
                    </div>

                    {/* Center Spine Shadow Overlay */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />

                    {/* Right Page (Architectural/Graphic composition) */}
                    <div
                      className="w-1/2 relative overflow-hidden flex flex-col justify-between p-4"
                      style={{
                        backgroundColor: concept.theme === "navy" ? "#0D1624" : concept.bgPage,
                      }}
                    >
                      {concept.theme === "light-sage" && (
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 bg-[#D1DEC8] relative overflow-hidden flex items-center justify-center">
                            <div className="w-16 h-28 rounded-full border border-black/20" />
                          </div>
                          <div className="w-1/2 bg-[#8FA282] flex flex-col justify-between p-3 text-white">
                            <div className="w-3 h-3 rotate-45 border border-white ml-auto" />
                            <div className="w-full h-1 bg-white/40 rounded-full" />
                          </div>
                        </div>
                      )}

                      {concept.theme === "navy" && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1B2E] via-[#1E3050] to-[#2B4673] flex flex-col justify-between p-3 text-white">
                          <div className="w-3 h-3 rotate-45 border border-[#38BDF8] ml-auto" />
                          <div className="space-y-1 opacity-70">
                            <div className="w-full h-0.5 bg-white/20" />
                            <div className="w-3/4 h-0.5 bg-white/20" />
                          </div>
                        </div>
                      )}

                      {concept.theme === "terracotta" && (
                        <div className="absolute inset-0 bg-[#F4EDE5] flex flex-col justify-between p-3">
                          <div className="w-3 h-3 rotate-45 border border-[#D97746] ml-auto" />
                          <div className="w-16 h-16 rounded-t-full bg-[#D97746] opacity-80 mx-auto mt-auto" />
                        </div>
                      )}

                      {concept.theme === "acid-lime" && (
                        <div className="absolute inset-0 bg-[#0B0C12] flex items-end">
                          <div
                            className="w-full h-full"
                            style={{
                              clipPath: "polygon(0 0, 100% 40%, 100% 100%, 0% 100%)",
                              backgroundColor: "#CCFF00",
                            }}
                          />
                          <div className="absolute top-3 right-3 w-3 h-3 rotate-45 border border-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{concept.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectWinner(concept.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-sm"
                          : "bg-stone-200/80 dark:bg-white/[0.08] hover:bg-stone-300/80 dark:hover:bg-white/[0.14] text-ink"
                      }`}
                    >
                      {isSelected ? <Check size={12} /> : null}
                      <span>{isSelected ? "Active Direction" : "Select Direction"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectionClashPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <DirectionClashView />
    </div>
  );
}

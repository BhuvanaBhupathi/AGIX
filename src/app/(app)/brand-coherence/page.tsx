"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  MoreHorizontal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

export default function BrandCoherencePage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [websiteUrl, setWebsiteUrl] = useState("https://www.innovatetech.io");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(78);

  const colors = [
    { name: "Coral", hex: "#FF6B6B", glow: "rgba(255, 107, 107, 0.4)" },
    { name: "Navy", hex: "#1A2B4C", glow: "rgba(26, 43, 76, 0.4)" },
    { name: "Cream", hex: "#F9F4E9", glow: "rgba(249, 244, 233, 0.4)" },
    { name: "Gold", hex: "#D4AF37", glow: "rgba(212, 175, 55, 0.4)" },
  ];

  const toneTags = [
    { label: "Professional", border: "border-rose-500/50", text: "text-rose-300", bg: "bg-rose-500/10" },
    { label: "Warm", border: "border-amber-400/50", text: "text-amber-300", bg: "bg-amber-400/10" },
    { label: "Confident", border: "border-amber-500/50", text: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Trustworthy", border: "border-slate-500/40", text: "text-slate-300", bg: "bg-slate-500/10" },
    { label: "Innovative", border: "border-amber-400/50", text: "text-amber-300", bg: "bg-amber-400/10" },
    { label: "Empathetic", border: "border-slate-500/40", text: "text-slate-300", bg: "bg-slate-500/10" },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setConfidenceScore(84);
    }, 1200);
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
            <ShieldCheck size={12} />
            <span>Intelligence · Brand Coherence Engine</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Brand Coherence Engine
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            Evaluates color harmony, typography pairing, and tone alignment across your brand identity elements.
          </p>
        </div>

        {selectedProject && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs font-mono text-ink">
            <span className="text-ink-tertiary">Active Project:</span>
            <span className="font-bold text-[#8B5CF6]">{selectedProject.name}</span>
          </div>
        )}
      </header>

      {/* ── URL / Asset Ingestion Bar (Merged with Web UI) ─────────── */}
      <div className="p-4 rounded-[24px] border border-border-subtle bg-surface shadow-subtle flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://www.innovatetech.io"
            className="w-full pl-4 pr-10 py-2.5 rounded-full border border-border-subtle bg-surface-subtle text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white font-medium text-xs transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(139,92,246,0.3)] shrink-0 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw size={13} className="animate-spin text-purple-300 dark:text-white" />
              <span>Auditing Brand Assets...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} className="text-purple-300 dark:text-white" />
              <span>Analyze Brand Coherence</span>
            </>
          )}
        </button>
      </div>

      {/* ── Two Large Dashboard Cards (matching Image 5) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Extracted Brand Elements */}
        <div className="rounded-[24px] p-6 border border-border-subtle bg-surface shadow-subtle relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Extracted Brand Elements
                </h3>
                <p className="text-[11px] text-ink-tertiary font-mono">
                  Identified palette and typography specimens
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-stone-100/80 dark:bg-white/[0.04] text-ink font-bold border border-border-subtle">
                4 Colors · 2 Typefaces
              </span>
            </div>

            {/* Brand Color Palette Swatches */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-ink-secondary">Brand Color Palette</h4>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle">
                    <div
                      className="h-12 w-12 rounded-full border border-black/10 dark:border-white/20 shadow-md cursor-pointer transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.hex,
                        boxShadow: `0 0 16px ${c.glow}`,
                      }}
                    />
                    <span className="text-xs font-bold text-ink">{c.name}</span>
                    <span className="text-[10px] font-mono text-ink-tertiary">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-border-subtle" />

            {/* Primary Fonts */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-ink-secondary">Primary Fonts</h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle">
                  <span className="text-[10px] text-ink-tertiary font-mono uppercase tracking-wider block">Headline Font</span>
                  <p className="text-base font-bold text-ink mt-0.5">
                    Innovate Tech: Building the Future
                  </p>
                  <span className="text-[11px] text-[#8B5CF6] font-mono font-medium">Poppins Bold / Satoshi</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle">
                  <span className="text-[10px] text-ink-tertiary font-mono uppercase tracking-wider block">Body Font</span>
                  <p className="text-xs font-normal text-ink mt-0.5">
                    Empowering modern brands with AI-driven visual direction and automated aesthetic alignment.
                  </p>
                  <span className="text-[11px] text-[#8B5CF6] font-mono font-medium">Inter Regular</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Brand Tone Analysis */}
        <div className="rounded-[24px] p-6 border border-border-subtle bg-surface shadow-subtle relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="text-base font-bold text-ink tracking-tight">
                  Brand Tone Analysis
                </h3>
                <p className="text-[11px] text-ink-tertiary font-mono">
                  Perceptual tone alignment & sentiment vectors
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Coherent
              </span>
            </div>

            {/* Speedometer Confidence Arc (matching Image 5) */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <svg viewBox="0 0 200 120" className="w-56 h-36">
                <defs>
                  <linearGradient id="gaugeGradMerged" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="50%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                </defs>

                {/* Background Track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="text-stone-200 dark:text-white/10"
                />

                {/* Gradient Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGradMerged)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - confidenceScore / 100)}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />

                {/* Needle */}
                <line
                  x1="100"
                  y1="100"
                  x2={100 + 65 * Math.cos(Math.PI * (1 + confidenceScore / 100))}
                  y2={100 + 65 * Math.sin(Math.PI * (1 + confidenceScore / 100))}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-ink"
                />
                <circle cx="100" cy="100" r="4" fill="currentColor" className="text-ink" />
              </svg>

              {/* Score & Subtitle in center */}
              <div className="absolute bottom-2 text-center">
                <span className="text-2xl font-black text-ink">{confidenceScore}%</span>
                <p className="text-[11px] text-ink-tertiary font-medium">Confidence Score</p>
              </div>
            </div>

            {/* Tone Tags Grid (2 columns of 3 pills matching Image 5) */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {toneTags.map((t) => (
                <div
                  key={t.label}
                  className={`py-2 px-3 rounded-xl border ${t.border} ${t.bg} text-center text-xs font-semibold ${t.text} transition-transform hover:scale-102`}
                >
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

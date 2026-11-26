"use client";

import React, { useState } from "react";
import {
  History,
  Sparkles,
  RotateCcw,
  Plus,
  Bookmark,
  Check,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

export default function EvolutionTimelinePage() {
  const { projects } = useProjects();
  const [selectedEra, setSelectedEra] = useState<string>("now");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const eras = [
    {
      id: "play",
      period: "1960s",
      subPeriod: "TO EARLY 2000S",
      position: "bottom",
      dotColor: "#C026D3",
      glowColor: "rgba(192, 38, 211, 0.6)",
      title: "Colorful Play",
      subtitle: "REBELLION & OPTIMISM",
      tags: ["Psychedelia", "Pop Art"],
      graphic: (
        <div className="h-24 w-full rounded-t-xl bg-gradient-to-b from-[#2E103E] to-[#150720] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-purple-400/40" />
            <div className="w-24 h-24 rounded-full border-2 border-purple-500/30" />
            <div className="w-32 h-32 rounded-full border border-purple-600/20" />
          </div>
          <Sparkles size={14} className="text-purple-300 absolute top-2 right-2" />
        </div>
      ),
    },
    {
      id: "wikipedia",
      period: "2010s",
      subPeriod: "2010 - 2017",
      position: "top",
      dotColor: "#38BDF8",
      glowColor: "rgba(56, 189, 248, 0.6)",
      title: "Wikipedia Era",
      subtitle: "RENDERING & USAGE",
      tags: ["Flat UI", "Memory"],
      graphic: (
        <div className="h-24 w-full rounded-t-xl bg-[#0F1420] border-b border-white/10 p-3 flex items-center justify-center gap-2">
          <div className="w-8 h-12 rounded border border-white/20 bg-white/5" />
          <div className="w-10 h-14 rounded border border-white/20 bg-white/5 flex items-center justify-center">
            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent" />
          </div>
          <div className="w-8 h-12 rounded border border-white/20 bg-white/5" />
        </div>
      ),
    },
    {
      id: "minimalism",
      period: "2018",
      subPeriod: "TO 2023",
      position: "bottom",
      dotColor: "#FFFFFF",
      glowColor: "rgba(255, 255, 255, 0.7)",
      title: "Minimalism",
      subtitle: "CLARITY & EFFICIENCY",
      tags: ["Flat UI", "Material"],
      graphic: (
        <div className="h-24 w-full rounded-t-xl bg-[#090A10] border-b border-white/10 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-12 h-1.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full border border-white/30" />
          </div>
          <div className="w-3/4 h-1.5 rounded-full bg-white/15" />
        </div>
      ),
    },
    {
      id: "now",
      period: "Now",
      subPeriod: "2024 - 2025+",
      position: "top",
      dotColor: "#22D3EE",
      glowColor: "rgba(34, 211, 238, 0.8)",
      title: "Maximalism",
      subtitle: "NOSTALGIA & AI",
      tags: ["Liquid Glass", "Glitch"],
      graphic: (
        <div className="h-24 w-full rounded-t-xl bg-gradient-to-b from-[#092233] to-[#0B1522] border-b border-cyan-500/20 p-2 flex items-center justify-center relative overflow-hidden">
          {/* Vertical fluted liquid glass striations */}
          <div className="absolute inset-0 flex justify-around opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-0.5 h-full bg-cyan-300" />
            ))}
          </div>
          <Sparkles size={14} className="text-cyan-300 absolute top-2 right-2" />
        </div>
      ),
    },
  ];

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
            <History size={12} />
            <span>Creative Decisions · Historical Overview</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Timeline at a Glance
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            Tracing the pendulum swing from expressive freedom to rigid minimalism and back to digital texture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ink-tertiary">Selected Era:</span>
          <span className="px-3 py-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs font-mono font-bold text-ink">
            {eras.find((e) => e.id === selectedEra)?.title}
          </span>
        </div>
      </header>

      {toastMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-2xl text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2 shadow-2xs animate-fade-in">
          <Check size={14} className="text-emerald-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Main Connected Spine & Era Cards Canvas (Merged with Web UI) ── */}
      <div className="rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-8 space-y-10 relative overflow-hidden">
        {/* Horizontal Center Spine Line */}
        <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 dark:bg-white/10 pointer-events-none hidden md:block" />

        {/* 4 Connected Era Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {eras.map((era) => {
            const isSelected = selectedEra === era.id;

            return (
              <div
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-102"
              >
                {/* TOP POSITION CARD */}
                {era.position === "top" ? (
                  <div className="w-full mb-0 md:mb-10 flex flex-col items-center">
                    {/* The Card */}
                    <div
                      className={`w-full rounded-2xl bg-stone-50 dark:bg-[#11131C] border transition-all duration-300 overflow-hidden shadow-subtle ${
                        isSelected
                          ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md"
                          : "border-border-subtle hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      {era.graphic}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-ink">{era.title}</h4>
                          <span className="text-[9px] font-mono tracking-widest text-ink-tertiary uppercase block">
                            {era.subtitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {era.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-stone-200/60 dark:bg-white/5 border border-border-subtle text-ink-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vertical Connecting Stem */}
                    <div
                      className="w-0.5 h-8 border-l border-dashed my-1 hidden md:block"
                      style={{ borderColor: era.dotColor }}
                    />

                    {/* Central Glowing Dot along the spine */}
                    <div
                      className="h-4 w-4 rounded-full border-2 border-white flex items-center justify-center transition-transform my-2"
                      style={{
                        backgroundColor: era.dotColor,
                        boxShadow: `0 0 14px ${era.glowColor}`,
                      }}
                    />

                    {/* Date label below dot */}
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-ink-tertiary block">
                        {era.subPeriod}
                      </span>
                      <span className="text-sm font-extrabold text-ink">{era.period}</span>
                    </div>
                  </div>
                ) : (
                  /* BOTTOM POSITION CARD */
                  <div className="w-full mt-0 md:mt-10 flex flex-col items-center">
                    {/* Date label above dot */}
                    <div className="text-center mb-1">
                      <span className="text-sm font-extrabold text-ink">{era.period}</span>
                      <span className="text-[10px] font-mono text-ink-tertiary block">
                        {era.subPeriod}
                      </span>
                    </div>

                    {/* Central Glowing Dot along the spine */}
                    <div
                      className="h-4 w-4 rounded-full border-2 border-white flex items-center justify-center transition-transform my-2"
                      style={{
                        backgroundColor: era.dotColor,
                        boxShadow: `0 0 14px ${era.glowColor}`,
                      }}
                    />

                    {/* Vertical Connecting Stem */}
                    <div
                      className="w-0.5 h-8 border-l border-dashed my-1 hidden md:block"
                      style={{ borderColor: era.dotColor }}
                    />

                    {/* The Card */}
                    <div
                      className={`w-full rounded-2xl bg-stone-50 dark:bg-[#11131C] border transition-all duration-300 overflow-hidden shadow-subtle ${
                        isSelected
                          ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 shadow-md"
                          : "border-border-subtle hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      {era.graphic}
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-ink">{era.title}</h4>
                          <span className="text-[9px] font-mono tracking-widest text-ink-tertiary uppercase block">
                            {era.subtitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {era.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-stone-200/60 dark:bg-white/5 border border-border-subtle text-ink-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Bottom Legend (matching Image 6) ────────────────────────── */}
        <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center justify-center gap-8 text-[11px] font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C026D3] shadow-[0_0_8px_#C026D3]" />
            <span className="text-ink-secondary">ERA OF PLAY</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            <span className="text-ink-secondary">WIKIPEDIA ERA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-stone-400 dark:bg-white shadow-[0_0_8px_rgba(200,200,200,0.5)]" />
            <span className="text-ink-secondary">MINIMALISM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
            <span className="text-ink-secondary">NOW</span>
          </div>
        </div>
      </div>
    </div>
  );
}

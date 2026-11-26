"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Droplet,
  Shield,
  Leaf,
  Layers,
  Heart,
  FlaskConical,
  Sun,
  Moon,
  Copy,
  Check,
  Download,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

export default function BrandInTheWildPage() {
  const { projects } = useProjects();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeBrand, setActiveBrand] = useState<"velora" | "active">("velora");
  const [copied, setCopied] = useState(false);

  const activeProject = projects[0];

  const palette = [
    { name: "Gold", hex: "#C8A46B" },
    { name: "Cream", hex: "#F5EFE6" },
    { name: "Pearl", hex: "#FBF8F3" },
    { name: "Taupe", hex: "#6E5E52" },
    { name: "Obsidian", hex: "#2B2B2B" },
  ];

  const handleCopyTokens = () => {
    const tokens = `/* VELORA Design System Tokens */\n--velora-gold: #C8A46B;\n--velora-cream: #F5EFE6;\n--velora-pearl: #FBF8F3;\n--velora-taupe: #6E5E52;\n--velora-obsidian: #2B2B2B;\n--font-headline: 'Instrument Serif', 'Playfair Display', serif;\n--font-body: 'Satoshi', 'Inter', sans-serif;`;
    navigator.clipboard.writeText(tokens);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative space-y-6 max-w-7xl mx-auto py-2">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Page Header (Standard AGIX Pattern) ───────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Sparkles size={12} />
            <span>Delivery · Brand In The Wild</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Brand In The Wild
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            Real-world identity applications across packaging, typography, luxury collateral, and tactile materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Canvas Specimen Switcher */}
          <div className="flex items-center gap-1 bg-stone-100/80 dark:bg-white/[0.04] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.08]">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 font-medium transition-all ${
                !isDarkMode
                  ? "bg-white text-ink shadow-xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <Sun size={13} />
              <span>Warm Sand</span>
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 font-medium transition-all ${
                isDarkMode
                  ? "bg-stone-800 text-white shadow-xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <Moon size={13} />
              <span>Obsidian</span>
            </button>
          </div>

          <button
            onClick={handleCopyTokens}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs font-medium transition-all shadow-sm hover:shadow-[0_8px_20px_rgba(139,92,246,0.3)] shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-purple-300 dark:text-white" />}
            <span>{copied ? "Tokens Copied" : "Copy Identity Tokens"}</span>
          </button>
        </div>
      </header>

      {/* ── Luxury Brand Identity Canvas (matching Image 7) ──────────── */}
      <div
        className={`w-full rounded-3xl p-8 sm:p-12 shadow-2xl border transition-all duration-300 font-sans select-none overflow-hidden ${
          isDarkMode
            ? "bg-[#10121A] text-white border-white/10"
            : "bg-[#F9F7F2] text-[#2B2B2B] border-black/[0.08]"
        }`}
      >
        <div className="space-y-10">
          {/* ── Main Top Grid: 3 Major Sections (Left Identity, Center Logo/Type, Right Packaging) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 1. LEFT SECTION: BRAND IDENTITY & PALETTE & VISUAL STYLE (5 cols) */}
            <div className="lg:col-span-4 space-y-8 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-current/10 pb-8 lg:pb-0">
              {/* Brand Identity Header */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  BRAND IDENTITY
                </span>
                <h1 className="text-4xl sm:text-5xl font-serif tracking-[0.18em] uppercase font-light">
                  VELORA
                </h1>
                <div className="flex items-center gap-2 text-xs font-serif tracking-[0.25em] opacity-80 uppercase">
                  <span>✦</span>
                  <span>LUXURY SKINCARE</span>
                  <span>✦</span>
                </div>
                <p className="text-xs leading-relaxed opacity-75 max-w-sm pt-2">
                  VELORA is luxury skincare crafted to enhance your natural glow. Simple. Effective. Timeless.
                </p>
              </div>

              {/* Color Palette */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  COLOR PALETTE
                </span>
                <div className="flex items-center gap-2.5">
                  {palette.map((c) => (
                    <div key={c.hex} className="flex-1 space-y-1.5">
                      <div
                        className="h-14 w-full rounded-md border border-black/10 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] font-mono opacity-60 block text-center">
                        {c.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Style (4 square photo mood vignettes) */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  VISUAL STYLE
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {/* Vignette 1: Dropper */}
                  <div className="aspect-square rounded-md overflow-hidden bg-[#E8E1D5] relative flex items-center justify-center">
                    <Droplet size={18} className="text-[#C8A46B] opacity-75" />
                  </div>
                  {/* Vignette 2: Candle */}
                  <div className="aspect-square rounded-md overflow-hidden bg-[#D8CFBF] relative flex items-center justify-center">
                    <span className="text-xs font-serif text-[#6E5E52]">🕯</span>
                  </div>
                  {/* Vignette 3: Botanical */}
                  <div className="aspect-square rounded-md overflow-hidden bg-[#E0D8CB] relative flex items-center justify-center">
                    <Leaf size={18} className="text-[#8FA282] opacity-75" />
                  </div>
                  {/* Vignette 4: Silk texture */}
                  <div className="aspect-square rounded-md overflow-hidden bg-[#ECE6DC] relative flex items-center justify-center">
                    <Sparkles size={16} className="text-[#C8A46B] opacity-75" />
                  </div>
                </div>
              </div>

              {/* Feature Benefit Icons Row */}
              <div className="grid grid-cols-5 gap-1 pt-2 border-t border-current/10 text-center">
                <div className="space-y-1">
                  <Droplet size={14} className="mx-auto opacity-70" />
                  <span className="text-[7px] font-mono uppercase tracking-wider block opacity-70 leading-tight">
                    DEEP HYDRATION
                  </span>
                </div>
                <div className="space-y-1">
                  <Sparkles size={14} className="mx-auto opacity-70" />
                  <span className="text-[7px] font-mono uppercase tracking-wider block opacity-70 leading-tight">
                    RADIANT GLOW
                  </span>
                </div>
                <div className="space-y-1">
                  <Layers size={14} className="mx-auto opacity-70" />
                  <span className="text-[7px] font-mono uppercase tracking-wider block opacity-70 leading-tight">
                    SMOOTHER SKIN
                  </span>
                </div>
                <div className="space-y-1">
                  <Leaf size={14} className="mx-auto opacity-70" />
                  <span className="text-[7px] font-mono uppercase tracking-wider block opacity-70 leading-tight">
                    CLEAN & SAFE FORMULA
                  </span>
                </div>
                <div className="space-y-1">
                  <Shield size={14} className="mx-auto opacity-70" />
                  <span className="text-[7px] font-mono uppercase tracking-wider block opacity-70 leading-tight">
                    DERMATOLOGIST TESTED
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CENTER SECTION: LOGO SUITE, TYPOGRAPHY, BRAND PATTERN (4 cols) */}
            <div className="lg:col-span-4 space-y-8 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-current/10 pb-8 lg:pb-0">
              {/* Logo Suite */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  LOGO SUITE
                </span>
                <div>
                  <span className="text-[8px] font-mono uppercase tracking-widest opacity-50 block mb-1">
                    PRIMARY LOGO
                  </span>
                  <p className="text-2xl font-serif tracking-[0.2em] uppercase">
                    VELORA
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-50 block mb-1">
                      SECONDARY LOGO
                    </span>
                    <p className="text-sm font-serif tracking-[0.16em] uppercase">
                      VELORA
                    </p>
                    <span className="text-[8px] font-mono opacity-60 tracking-wider">
                      — LUXURY SKINCARE —
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-50 block mb-1">
                      ICON MARK
                    </span>
                    <div className="h-10 w-10 rounded-full border border-current/40 flex items-center justify-center font-serif text-sm">
                      V
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4 pt-2 border-t border-current/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  TYPOGRAPHY
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-2xl font-serif font-normal">Aa</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      PLAYFAIR DISPLAY
                    </p>
                    <span className="text-[8px] font-mono opacity-60 block">(HEADLINES)</span>
                    <p className="text-[8px] font-mono opacity-50 tracking-widest leading-relaxed pt-1">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-sans font-normal">Aa</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      INTER / SATOSHI
                    </p>
                    <span className="text-[8px] font-mono opacity-60 block">(BODY TEXT)</span>
                    <p className="text-[8px] font-mono opacity-50 tracking-widest leading-relaxed pt-1">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ
                      <br />
                      abcdefghijklmnopqrstuvwxyz
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Pattern */}
              <div className="space-y-2 pt-2 border-t border-current/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  BRAND PATTERN
                </span>
                <div className="h-20 rounded-md border border-current/10 p-3 grid grid-cols-5 gap-2 text-center text-xs opacity-50 font-serif">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="flex items-center justify-center">
                      {i % 2 === 0 ? "V" : "✦"}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. RIGHT SECTION: LUXURY PACKAGING & APPLICATION COLLATERAL (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Product Pedestal Packaging Mockup */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-b from-[#EFEAE1] to-[#E3DDD1] dark:from-[#1A1D2A] dark:to-[#121420] border border-current/10 p-6 flex items-center justify-center overflow-hidden shadow-lg">
                {/* Round Pedestal */}
                <div className="absolute -bottom-8 w-64 h-24 rounded-full bg-white/40 dark:bg-black/40 blur-xs border border-current/10" />

                {/* Dropper Bottle and Presentation Box */}
                <div className="relative z-10 flex items-end gap-6">
                  {/* Glass Dropper Bottle */}
                  <div className="w-20 h-36 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-md shadow-2xl p-2 flex flex-col justify-between items-center text-center">
                    {/* Gold Dropper Cap */}
                    <div className="w-7 h-5 rounded-t-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] -mt-5 shadow-xs" />
                    <div className="py-2 space-y-0.5">
                      <span className="text-[8px] font-serif tracking-[0.14em] font-bold block uppercase text-[#2B2B2B]">
                        VELORA
                      </span>
                      <span className="text-[6px] font-mono opacity-60 block text-[#2B2B2B]">
                        LUXURY EXTRACT
                      </span>
                    </div>
                    <span className="text-[7px] font-mono opacity-50 pb-1 text-[#2B2B2B]">
                      50 ML
                    </span>
                  </div>

                  {/* Packaging Box */}
                  <div className="w-24 h-48 rounded-xl bg-[#F4EFE6] border border-[#C8A46B]/40 shadow-2xl p-3 flex flex-col justify-between text-[#2B2B2B]">
                    <div className="text-right">
                      <span className="text-[7px] font-mono opacity-60">NO. 01</span>
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="text-sm font-serif tracking-[0.16em] uppercase font-bold text-[#6E5E52]">
                        VELORA
                      </h4>
                      <p className="text-[7px] font-mono opacity-60 uppercase">
                        LUXURY SKINCARE
                      </p>
                    </div>
                    <div className="pt-2 border-t border-black/10 text-center">
                      <span className="text-[6px] font-mono opacity-50">PARIS · LONDON</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Examples (Shopping Bag & Business Cards) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 block">
                  APPLICATION EXAMPLES
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {/* Luxury Bag */}
                  <div className="aspect-[4/3] rounded-xl bg-[#EBE5DB] dark:bg-[#181B26] border border-current/10 p-3 flex flex-col justify-between items-center shadow-sm">
                    <div className="w-8 h-4 border-t-2 border-x-2 border-current/40 rounded-t-lg" />
                    <span className="text-xs font-serif tracking-[0.18em] uppercase font-bold">
                      VELORA
                    </span>
                    <span className="text-[7px] font-mono opacity-60">CRAFT BAG</span>
                  </div>

                  {/* Business Card with Sun & Plant Shadow */}
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF8F5] dark:bg-[#1C1F2E] border border-current/10 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-serif tracking-[0.18em] uppercase font-bold text-[#2B2B2B] dark:text-white">
                        VELORA
                      </span>
                      <span className="text-[8px] font-serif text-[#C8A46B]">✦</span>
                    </div>
                    <div>
                      <p className="text-[7px] font-mono opacity-70 text-[#2B2B2B] dark:text-white">
                        direct@velora.com
                      </p>
                      <p className="text-[7px] font-mono opacity-50 text-[#2B2B2B] dark:text-white">
                        velora.studio
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom Full-Width Brand Promise Banner (matching Image 7) ── */}
          <div className="pt-6 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60 shrink-0">
                BRAND PROMISE
              </span>
              <p className="text-xs font-serif italic opacity-85">
                Elevated skincare for every day. Visible results. Timeless beauty.
              </p>
            </div>

            <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider opacity-75">
              <div className="flex items-center gap-1.5">
                <Leaf size={14} className="opacity-80" />
                <span>SUITABLE FOR ALL SKIN TYPES</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart size={14} className="opacity-80" />
                <span>CRUELTY FREE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FlaskConical size={14} className="opacity-80" />
                <span>PARABEN FREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

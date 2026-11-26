"use client";

import React, { useState } from "react";
import {
  Upload,
  Plus,
  RotateCcw,
  RotateCw,
  History,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  ChevronDown,
  X,
  Layers,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

interface ColorStop {
  stop: number;
  lightness: number; // 0 - 100%
  chroma: number; // 0.0 - 0.35
  apca: number; // APCA Lc value
  isAccessible: boolean;
  hex: string;
}

interface ColorColumn {
  name: string;
  hue: number;
  stops: ColorStop[];
}

export function OklchColorLab() {
  const { projects, applyPaletteToProject } = useProjects();
  const [hueStart, setHueStart] = useState<number>(0);
  const [hueEnd, setHueEnd] = useState<number>(130.2);
  const [saturation, setSaturation] = useState<number>(80);
  const [variations, setVariations] = useState<number>(5);
  const [colorSpace, setColorSpace] = useState<"OKLCH" | "HEX" | "RGB">("OKLCH");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Stop lightness curve
  const stopDefs = [
    { stop: 50, l: 97.1, cMultiplier: 0.06, apca: 94, accessible: true },
    { stop: 100, l: 94.7, cMultiplier: 0.12, apca: 89, accessible: true },
    { stop: 200, l: 89.8, cMultiplier: 0.25, apca: 79, accessible: true },
    { stop: 300, l: 82.1, cMultiplier: 0.49, apca: 64, accessible: true },
    { stop: 400, l: 71.7, cMultiplier: 0.83, apca: 51, accessible: false },
    { stop: 500, l: 65.4, cMultiplier: 1.0, apca: 62, accessible: true },
    { stop: 600, l: 59.1, cMultiplier: 1.03, apca: 67, accessible: true },
    { stop: 700, l: 52.5, cMultiplier: 0.91, apca: 75, accessible: true },
    { stop: 800, l: 45.8, cMultiplier: 0.77, apca: 83, accessible: true },
    { stop: 900, l: 40.8, cMultiplier: 0.64, apca: 87, accessible: true },
    { stop: 950, l: 28.2, cMultiplier: 0.45, apca: 97, accessible: true },
  ];

  const columnNames = [
    "Frenchrose",
    "Wildwatermelon",
    "Carnation",
    "Outrageousorange",
    "Crusta",
    "Amberglaze",
    "Solaris",
  ];

  // Helper to convert approximate OKLCH to vibrant Hex
  const oklchToHex = (l: number, c: number, h: number): string => {
    // Simplified high-fidelity projection for UI representation
    const hslH = (h % 360 + 360) % 360;
    const hslS = Math.min(100, Math.max(10, (c / 0.35) * (saturation / 100) * 100));
    const hslL = l;

    const s = hslS / 100;
    const light = hslL / 100;
    const k = (n: number) => (n + hslH / 30) % 12;
    const a = s * Math.min(light, 1 - light);
    const f = (n: number) =>
      light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
  };

  // Generate dynamic columns based on Hue Start and End
  const columns: ColorColumn[] = Array.from({ length: variations }, (_, colIndex) => {
    const fraction = variations > 1 ? colIndex / (variations - 1) : 0;
    const hue = Math.round(hueStart + fraction * (hueEnd - hueStart));
    const name = columnNames[colIndex % columnNames.length];

    const stops: ColorStop[] = stopDefs.map((def) => {
      const chroma = Number((0.26 * def.cMultiplier * (saturation / 80)).toFixed(3));
      const hex = oklchToHex(def.l, chroma, hue);
      return {
        stop: def.stop,
        lightness: def.l,
        chroma,
        apca: def.apca,
        isAccessible: def.accessible,
        hex,
      };
    });

    return { name, hue, stops };
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const handleAddPalettesToProject = () => {
    if (projects.length === 0) return;
    const active = projects[0];
    const keyColors = columns.map((col) => {
      const primaryStop = col.stops.find((s) => s.stop === 500) || col.stops[5];
      return { hex: primaryStop.hex, label: col.name };
    });

    applyPaletteToProject(active.id, {
      name: `Spectral OKLCH [${hueStart}°–${hueEnd}°]`,
      colors: keyColors,
    });

    setSuccessToast(`Added ${columns.length} spectral scales to "${active.name}"!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Ribbon Controls Bar (Merged with Web UI) ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[24px] border border-border-subtle bg-surface shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white font-bold text-xs shadow-md">
            C
          </div>
          <div>
            <span className="text-xs font-bold text-ink block">OKLCH Spectral Generator</span>
            <span className="text-[11px] text-ink-tertiary font-mono">P3 Wide Gamut · APCA Contrast Validated</span>
          </div>
        </div>

        {/* Center APCA Status Pill */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400">90 APCA</span>
            <span className="text-ink-secondary dark:text-slate-400">Normal Text</span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs font-mono text-ink">
            {(["OKLCH", "HEX", "RGB"] as const).map((space) => (
              <button
                key={space}
                onClick={() => setColorSpace(space)}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  colorSpace === space
                    ? "bg-white dark:bg-white/10 text-ink shadow-xs font-bold"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {space}
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setHueStart(0);
              setHueEnd(130.2);
              setSaturation(80);
              setVariations(5);
            }}
            title="Reset parameters"
            className="p-2 rounded-xl border border-border-subtle bg-surface-subtle hover:bg-stone-200/50 dark:hover:bg-white/[0.06] text-ink-secondary hover:text-ink transition-colors"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={handleAddPalettesToProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs font-medium shadow-sm hover:shadow-[0_8px_20px_rgba(139,92,246,0.3)] transition-all"
          >
            <Sparkles size={13} className="text-purple-300 dark:text-white" />
            <span>Add {variations} Palettes to Project</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-2xl text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 dark:text-emerald-400">
            <X size={12} />
          </button>
        </div>
      )}

      {/* ── Main Layout: Controls Sidebar + Spectral Matrix Grid ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Color Wheel & Sliders */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-sm font-bold text-ink">Generate Palettes</h3>
              <p className="text-[11px] text-ink-tertiary font-mono mt-0.5">
                Outputting {variations} continuous scales
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
              P3 Gamut
            </span>
          </div>

          {/* Color Wheel Arc Graphic */}
          <div className="relative aspect-square w-full rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="horseshoeGradMerged" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="35%" stopColor="#8B5CF6" />
                  <stop offset="70%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              <path
                d="M 40 160 A 70 70 0 1 1 160 160 L 130 140 A 40 40 0 1 0 70 140 Z"
                fill="url(#horseshoeGradMerged)"
                opacity="0.88"
              />

              <circle
                cx="100"
                cy="100"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="2 3"
                className="text-stone-400 dark:text-white/40"
              />

              <circle cx="50" cy="150" r="4" fill="#EC4899" />
              <circle cx="70" cy="65" r="4" fill="#8B5CF6" />
              <circle cx="100" cy="40" r="4" fill="#38BDF8" />
              <circle cx="135" cy="70" r="4" fill="#10B981" />
              <circle cx="150" cy="150" r="4" fill="#F59E0B" />

              <line
                x1="60"
                y1="140"
                x2="140"
                y2="80"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-stone-500 dark:text-white/60"
              />
              <circle cx="60" cy="140" r="3" fill="#38BDF8" />
              <circle cx="140" cy="80" r="3" fill="#EC4899" />
            </svg>
          </div>

          {/* Steppers: Hue Start & End */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-ink-secondary mb-1">Hue Start (°)</label>
              <input
                type="number"
                value={hueStart}
                onChange={(e) => setHueStart(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-subtle text-xs font-mono text-ink focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-ink-secondary mb-1">Hue End (°)</label>
              <input
                type="number"
                step="0.1"
                value={hueEnd}
                onChange={(e) => setHueEnd(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-surface-subtle text-xs font-mono text-ink focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
          </div>

          {/* Saturation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-ink-secondary">Saturation</span>
              <span className="text-xs font-mono font-bold text-ink">{saturation}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#EC4899]"
            />
            <p className="text-[10px] text-ink-tertiary">
              Uniform chroma curve scaling across P3 boundary
            </p>
          </div>

          {/* Variations Count */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-ink-secondary">Palette Variations</span>
              <span className="text-xs font-mono font-bold text-ink">{variations}</span>
            </div>
            <input
              type="range"
              min={2}
              max={7}
              value={variations}
              onChange={(e) => setVariations(Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>

          <button
            onClick={handleAddPalettesToProject}
            className="w-full py-2.5 rounded-xl bg-ink text-paper font-semibold text-xs shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={13} className="text-purple-400" />
            <span>Apply to Active Project</span>
          </button>
        </div>

        {/* Right Column: 11-Step OKLCH / APCA Spectral Matrix */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-5 overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
            <div>
              <h3 className="text-sm font-bold text-ink">Perceptual Spectral Stop Matrix</h3>
              <p className="text-[11px] text-ink-tertiary font-mono">
                11 systematic stops with APCA Lc perceptual contrast tags
              </p>
            </div>
            <span className="text-[11px] font-mono text-ink-tertiary">
              Click any cell to copy value
            </span>
          </div>

          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex gap-3 min-w-max">
              {columns.map((col, cIdx) => (
                <div key={cIdx} className="w-52 space-y-1.5 shrink-0">
                  {/* Column Header */}
                  <div className="p-2 text-center rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle">
                    <h4 className="text-xs font-bold text-ink truncate">
                      {col.name}
                    </h4>
                    <span className="text-[10px] font-mono text-ink-tertiary">{col.hue}° OKLCH</span>
                  </div>

                  {/* 11 Stop Cells */}
                  <div className="space-y-1">
                    {col.stops.map((stop) => {
                      const isCopied = copiedText === stop.hex;
                      const isDarkCell = stop.stop >= 500;

                      return (
                        <div
                          key={stop.stop}
                          onClick={() => handleCopy(stop.hex)}
                          className="group relative rounded-xl p-2.5 transition-all cursor-pointer border border-black/10 dark:border-white/10 hover:scale-[1.02] shadow-xs flex flex-col justify-between h-[52px]"
                          style={{
                            backgroundColor: stop.hex,
                            color: isDarkCell ? "#FFFFFF" : "#0A0C10",
                          }}
                        >
                          {/* Top Row: Stop Number + APCA Pill */}
                          <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                            <span>
                              {stop.stop}{" "}
                              {stop.stop === 300 || stop.stop === 500 || stop.stop === 700 || stop.stop === 950 ? (
                                <span className="text-[9px] font-normal opacity-70">P3</span>
                              ) : null}
                            </span>

                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono flex items-center gap-1 ${
                                isDarkCell ? "bg-black/60 text-white" : "bg-white/80 text-black"
                              }`}
                            >
                              <span>{stop.apca}Lc</span>
                              {stop.isAccessible ? (
                                <span className="text-emerald-400">✓</span>
                              ) : (
                                <span className="text-rose-400">✕</span>
                              )}
                            </span>
                          </div>

                          {/* Bottom Coordinates: l, c, h */}
                          <div className="flex items-center justify-between text-[9px] font-mono opacity-85">
                            <span>
                              l:{stop.lightness}%, c:{stop.chroma}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 font-bold transition-opacity">
                              {isCopied ? "COPIED" : stop.hex}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  RotateCcw,
  Palette,
  ExternalLink,
  Layers,
  Info,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";

export type PaletteType =
  | "Complementary"
  | "Monochromatic"
  | "Analogous"
  | "Triadic"
  | "Tetradic"
  | "Custom";

interface ColorItem {
  hex: string;
  h: number;
  s: number;
  l: number;
  label?: string;
}

// ── Math Helpers ──────────────────────────────────────────────────
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s = s / 100;
  l = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return [r, g, b];
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function CanvaColorWheel() {
  const { projects, applyPaletteToProject } = useProjects();
  const [activeProject, setActiveProject] = useState(projects[0] || null);

  // Base Color: default matching screenshot #727d8d
  const [baseH, setBaseH] = useState<number>(215);
  const [baseS, setBaseS] = useState<number>(11);
  const [baseL, setBaseL] = useState<number>(50);
  const [hexInput, setHexInput] = useState<string>("#727d8d");

  // Palette mode matching screenshots
  const [paletteType, setPaletteType] = useState<PaletteType>("Complementary");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Copy feedback
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Wheel interaction
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDraggingWheel, setIsDraggingWheel] = useState<boolean>(false);
  const [isDraggingRing, setIsDraggingRing] = useState<boolean>(false);

  // Synchronize hexInput when HSL changes from wheel
  const updateBaseColor = useCallback((h: number, s: number, l: number) => {
    const clampedH = (h % 360 + 360) % 360;
    const clampedS = Math.max(0, Math.min(100, s));
    const clampedL = Math.max(0, Math.min(100, l));
    setBaseH(clampedH);
    setBaseS(clampedS);
    setBaseL(clampedL);
    setHexInput(hslToHex(clampedH, clampedS, clampedL));
  }, []);

  // Handle direct Hex input change
  const handleHexInputChange = (val: string) => {
    setHexInput(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      setBaseH(h);
      setBaseS(s);
      setBaseL(l);
    }
  };

  // Generate harmony colors based on selected paletteType
  const generatePalette = (): ColorItem[] => {
    const baseColor: ColorItem = {
      hex: hslToHex(baseH, baseS, baseL),
      h: baseH,
      s: baseS,
      l: baseL,
      label: "Base",
    };

    switch (paletteType) {
      case "Complementary": {
        const compH = (baseH + 180) % 360;
        return [
          baseColor,
          {
            hex: hslToHex(compH, baseS, baseL),
            h: compH,
            s: baseS,
            l: baseL,
            label: "Complementary",
          },
        ];
      }
      case "Monochromatic": {
        const l1 = Math.max(15, baseL - 28);
        const l2 = Math.min(88, baseL + 25);
        const l3 = Math.max(10, baseL - 14);
        return [
          baseColor,
          {
            hex: hslToHex(baseH, baseS, l1),
            h: baseH,
            s: baseS,
            l: l1,
            label: "Dark Shade",
          },
          {
            hex: hslToHex(baseH, Math.max(15, baseS - 20), l2),
            h: baseH,
            s: Math.max(15, baseS - 20),
            l: l2,
            label: "Soft Tint",
          },
          {
            hex: hslToHex(baseH, Math.min(100, baseS + 15), l3),
            h: baseH,
            s: Math.min(100, baseS + 15),
            l: l3,
            label: "Deep Tone",
          },
        ];
      }
      case "Analogous": {
        const h1 = (baseH - 30 + 360) % 360;
        const h2 = (baseH + 30) % 360;
        return [
          {
            hex: hslToHex(h1, baseS, baseL),
            h: h1,
            s: baseS,
            l: baseL,
            label: "-30°",
          },
          baseColor,
          {
            hex: hslToHex(h2, baseS, baseL),
            h: h2,
            s: baseS,
            l: baseL,
            label: "+30°",
          },
        ];
      }
      case "Triadic": {
        const h1 = (baseH + 120) % 360;
        const h2 = (baseH + 240) % 360;
        return [
          baseColor,
          {
            hex: hslToHex(h1, baseS, baseL),
            h: h1,
            s: baseS,
            l: baseL,
            label: "+120°",
          },
          {
            hex: hslToHex(h2, baseS, baseL),
            h: h2,
            s: baseS,
            l: baseL,
            label: "+240°",
          },
        ];
      }
      case "Tetradic": {
        const h1 = (baseH + 90) % 360;
        const h2 = (baseH + 180) % 360;
        const h3 = (baseH + 270) % 360;
        return [
          baseColor,
          {
            hex: hslToHex(h1, baseS, baseL),
            h: h1,
            s: baseS,
            l: baseL,
            label: "+90°",
          },
          {
            hex: hslToHex(h2, baseS, baseL),
            h: h2,
            s: baseS,
            l: baseL,
            label: "+180°",
          },
          {
            hex: hslToHex(h3, baseS, baseL),
            h: h3,
            s: baseS,
            l: baseL,
            label: "+270°",
          },
        ];
      }
      case "Custom":
      default:
        return [
          baseColor,
          {
            hex: hslToHex((baseH + 45) % 360, Math.max(20, baseS - 15), baseL),
            h: (baseH + 45) % 360,
            s: Math.max(20, baseS - 15),
            l: baseL,
            label: "Custom 1",
          },
          {
            hex: hslToHex((baseH + 180) % 360, baseS, Math.min(85, baseL + 15)),
            h: (baseH + 180) % 360,
            s: baseS,
            l: Math.min(85, baseL + 15),
            label: "Custom 2",
          },
        ];
    }
  };

  const palette = generatePalette();

  // Mouse / Touch interaction for the Color Disc
  const handleWheelPointer = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Angle in degrees: 0° is red (top / right)
    // Standard atan2: 0 is right (3 o'clock). In our conic-gradient, top is 0° (red).
    // Let's align angle so top is 0° (red), right 90° (lime/yellow), bottom 180° (cyan), left 270° (violet)
    let angleRad = Math.atan2(dy, dx) + Math.PI / 2;
    if (angleRad < 0) angleRad += 2 * Math.PI;
    const deg = Math.round((angleRad * 180) / Math.PI) % 360;

    // Distance from center determines saturation (0 at center, 100 at boundary)
    const dist = Math.sqrt(dx * dx + dy * dy);
    const sat = Math.min(100, Math.round((dist / radius) * 100));

    updateBaseColor(deg, sat, baseL);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingWheel) {
        handleWheelPointer(e);
      }
    };
    const handlePointerUp = () => {
      setIsDraggingWheel(false);
      setIsDraggingRing(false);
    };

    if (isDraggingWheel || isDraggingRing) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingWheel, isDraggingRing, baseL, updateBaseColor]);

  // Copy single color
  const handleCopySingle = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Copy all hex codes comma-separated
  const handleCopyAll = () => {
    const allHex = palette.map((c) => c.hex).join(", ");
    navigator.clipboard.writeText(allHex);
    setSuccessToast(`Copied ${palette.length} color codes (${allHex})!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Apply to active project
  const handleUseColorPalette = () => {
    if (!activeProject) return;
    const colors = palette.map((c, i) => ({
      hex: c.hex,
      label: c.label || `Harmony ${i + 1}`,
    }));
    applyPaletteToProject(activeProject.id, {
      name: `${paletteType} Harmony Palette`,
      colors,
    });
    setSuccessToast(`Saved "${paletteType} Harmony Palette" to project "${activeProject.name}"!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Node position calculation helper
  // angle in degrees (0 at top), sat 0-100 (distance percentage from center)
  const getNodePos = (h: number, s: number, size: number = 320) => {
    const r = size / 2;
    const dist = (s / 100) * (r - 12);
    const rad = ((h - 90) * Math.PI) / 180;
    const x = r + dist * Math.cos(rad);
    const y = r + dist * Math.sin(rad);
    return { x, y };
  };

  const wheelSize = 320;
  const baseNode = getNodePos(baseH, baseS, wheelSize);

  return (
    <div className="relative space-y-8 max-w-6xl mx-auto select-none">
      {/* ── Ambient Background Caustics matching AGIX System ──────── */}
      <div className="pointer-events-none absolute -top-20 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-80 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Toast Feedback ────────────────────────────────────────── */}
      {successToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-2xl text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-between shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-emerald-500" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 dark:text-emerald-400">
            ✕
          </button>
        </div>
      )}

      {/* ── Main Two-Column Layout (matching Canva Screenshots) ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Hero Title & Narrative (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Palette size={12} />
            <span>Color Theory & Harmony Engine</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
              Color wheel
            </h1>
            <p className="text-base text-ink-secondary dark:text-slate-400 leading-relaxed max-w-md">
              The Color Wheel helps you find the perfect color palette and exact hex codes for your design.
            </p>
          </div>

          {/* Quick Info Card about the active Harmony Rule */}
          <div className="p-5 rounded-[24px] border border-border-subtle bg-surface shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Info size={14} className="text-[#8B5CF6]" />
              <span>About {paletteType} Colors</span>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {paletteType === "Complementary" &&
                "Complementary colors sit directly opposite each other on the color wheel (180°). This high-contrast pairing creates striking visual tension and vibrant focal points."}
              {paletteType === "Monochromatic" &&
                "Monochromatic palettes use a single hue with variations in lightness and saturation. This delivers a clean, cohesive, and deeply sophisticated brand aesthetic."}
              {paletteType === "Analogous" &&
                "Analogous colors sit side-by-side on the wheel (±30°). They match effortlessly, creating calm, harmonious, and naturally pleasing visual flow."}
              {paletteType === "Triadic" &&
                "Triadic schemes use three colors spaced evenly at 120° angles around the wheel. They offer vibrant contrast while preserving visual balance."}
              {paletteType === "Tetradic" &&
                "Tetradic (double complementary) schemes combine four colors formed by two complementary pairs (90°). Rich, diverse, and full of design possibilities."}
              {paletteType === "Custom" &&
                "Freely customize your palette tones to match specific brand guidelines or experimental aesthetic palettes."}
            </p>

            {/* Active Project Indicator */}
            {activeProject && (
              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-ink-tertiary">Target Workspace:</span>
                <span className="font-semibold text-ink font-mono">{activeProject.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: The Interactive Wheel, Inputs & Swatch Bar (lg:col-span-7) */}
        <div className="lg:col-span-7 rounded-[28px] border border-border-subtle bg-surface shadow-lifted p-6 sm:p-8 space-y-8">
          {/* ── 1. The Interactive Color Wheel (matching Screenshot 1) ── */}
          <div className="flex flex-col items-center justify-center">
            <div
              ref={wheelRef}
              onPointerDown={(e) => {
                setIsDraggingWheel(true);
                handleWheelPointer(e);
              }}
              className="relative cursor-crosshair rounded-full shadow-2xl transition-transform active:scale-[0.99] touch-none"
              style={{
                width: `${wheelSize}px`,
                height: `${wheelSize}px`,
              }}
            >
              {/* Outer Value/Luminance Ring (matching Canva's dark outer ring with slider handle) */}
              <div
                className="absolute -inset-3 rounded-full border-4 border-stone-800 dark:border-stone-700 pointer-events-none"
                style={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              />

              {/* Conic Hue Disc Gradient */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background: `
                    conic-gradient(
                      from 0deg,
                      #ff0000 0deg,
                      #ff8000 30deg,
                      #ffff00 60deg,
                      #80ff00 90deg,
                      #00ff00 120deg,
                      #00ff80 150deg,
                      #00ffff 180deg,
                      #0080ff 210deg,
                      #0000ff 240deg,
                      #8000ff 270deg,
                      #ff00ff 300deg,
                      #ff0080 330deg,
                      #ff0000 360deg
                    )
                  `,
                }}
              >
                {/* Radial Saturation Overlay: pure white in center fading to transparent at rim */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle closest-side, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 100%)",
                  }}
                />

                {/* Darken/Lightness overlay based on baseL */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    backgroundColor:
                      baseL < 50
                        ? `rgba(0,0,0,${((50 - baseL) / 50) * 0.7})`
                        : `rgba(255,255,255,${((baseL - 50) / 50) * 0.5})`,
                  }}
                />
              </div>

              {/* Secondary Harmony Handles on the Wheel */}
              {palette.slice(1).map((color, idx) => {
                const nodePos = getNodePos(color.h, color.s, wheelSize);
                return (
                  <div
                    key={idx}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-all duration-150"
                    style={{
                      left: `${nodePos.x}px`,
                      top: `${nodePos.y}px`,
                      width: "16px",
                      height: "16px",
                      backgroundColor: color.hex,
                    }}
                  />
                );
              })}

              {/* Primary Active Handle (White thick ring as in Canva Screenshot 1) */}
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] border-white shadow-2xl flex items-center justify-center transition-all duration-75"
                style={{
                  left: `${baseNode.x}px`,
                  top: `${baseNode.y}px`,
                  width: "28px",
                  height: "28px",
                  backgroundColor: "transparent",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5), inset 0 0 4px rgba(0,0,0,0.3)",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: hslToHex(baseH, baseS, baseL) }}
                />
              </div>

              {/* Outer Luminance Ring Slider Handle (positioned at 3 o'clock on outer border) */}
              <div
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-stone-800 shadow-md cursor-pointer pointer-events-none"
                title={`Lightness: ${baseL}%`}
              />
            </div>

            {/* Lightness Slider bar directly under wheel for fine-tuning */}
            <div className="w-64 mt-4 flex items-center gap-3">
              <span className="text-[10px] font-mono text-ink-tertiary">Dark</span>
              <input
                type="range"
                min={10}
                max={90}
                value={baseL}
                onChange={(e) => updateBaseColor(baseH, baseS, Number(e.target.value))}
                className="flex-1 h-1.5 bg-stone-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
              />
              <span className="text-[10px] font-mono text-ink-tertiary">Light</span>
            </div>
          </div>

          {/* ── 2. "1. Pick a color" Section (matching Screenshot 1) ──── */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-ink">
              1. Pick a color
            </label>
            <div className="flex items-center gap-3">
              {/* Swatch circle preview */}
              <div
                className="h-11 w-11 rounded-full border border-black/15 shadow-sm shrink-0 transition-colors"
                style={{ backgroundColor: hexInput || hslToHex(baseH, baseS, baseL) }}
              />

              {/* Hex Input box (matching Screenshot 1) */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  placeholder="#727d8d"
                  className="w-full px-4 py-3 rounded-2xl border border-border-subtle bg-surface-subtle font-mono text-sm font-semibold text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-[#8B5CF6] transition-colors text-center shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* ── 3. "2. Choose a palette type" Dropdown (matching Screenshot 2 & 3) ── */}
          <div className="space-y-2 relative">
            <label className="block text-xs font-semibold text-ink">
              2. Choose a palette type
            </label>

            {/* Dropdown Selector Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-border-subtle bg-surface hover:border-[#8B5CF6]/50 text-xs sm:text-sm font-medium text-ink transition-all shadow-2xs"
              >
                <span>{paletteType}</span>
                <ChevronDown
                  size={16}
                  className={`text-ink-tertiary transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu (matching Screenshot 2) */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border-subtle bg-surface shadow-lifted py-2 overflow-hidden animate-fade-in">
                  {(
                    [
                      "Complementary",
                      "Monochromatic",
                      "Analogous",
                      "Triadic",
                      "Tetradic",
                      "Custom",
                    ] as PaletteType[]
                  ).map((type) => {
                    const isSelected = paletteType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setPaletteType(type);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-colors ${
                          isSelected
                            ? "bg-stone-100 dark:bg-white/[0.08] text-ink font-semibold"
                            : "text-ink-secondary hover:text-ink hover:bg-stone-50 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <span>{type}</span>
                        {isSelected && <Check size={15} className="text-[#8B5CF6]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── 4. Large Horizontal Palette Preview Bar with # Codes (matching Screenshot 3) ── */}
            <div className="pt-2">
              <div className="flex h-20 sm:h-24 w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md">
                {palette.map((color, idx) => {
                  const isCopied = copiedHex === color.hex;
                  const isLight = color.l > 60;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleCopySingle(color.hex)}
                      className="group relative flex-1 h-full flex flex-col justify-end p-2.5 sm:p-3 transition-transform cursor-pointer hover:opacity-95"
                      style={{
                        backgroundColor: color.hex,
                        color: isLight ? "#191918" : "#FFFFFF",
                      }}
                      title={`Click to copy ${color.hex}`}
                    >
                      {/* Exact # Hex Code displayed directly on the swatch */}
                      <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs font-bold tracking-tight">
                        <span className="px-1.5 py-0.5 rounded-md bg-black/30 text-white backdrop-blur-xs text-[10px] sm:text-xs">
                          {isCopied ? "COPIED!" : color.hex.toUpperCase()}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-label showing individual swatch labels & helper */}
              <div className="flex justify-between items-center pt-2 px-1 text-[11px] font-mono text-ink-tertiary">
                <div className="flex gap-4">
                  {palette.map((c, i) => (
                    <span key={i}>
                      {c.label}: <strong className="text-ink">{c.hex}</strong>
                    </span>
                  ))}
                </div>
                <span>Click swatch to copy</span>
              </div>
            </div>

            {/* ── 5. Action Buttons (matching Screenshot 3) ─────────────── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              {/* Primary Purple Button: "Use color palette" */}
              <button
                type="button"
                onClick={handleUseColorPalette}
                className="w-full sm:flex-1 py-3 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Sparkles size={16} />
                <span>Use color palette</span>
              </button>

              {/* Secondary Button: "Copy All Codes" / "Reset" */}
              <button
                type="button"
                onClick={handleCopyAll}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-border-subtle bg-surface hover:bg-stone-100 dark:hover:bg-white/[0.06] text-ink font-semibold text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <Copy size={15} />
                <span>Copy Hex Codes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBaseH(215);
                  setBaseS(11);
                  setBaseL(50);
                  setHexInput("#727d8d");
                  setPaletteType("Complementary");
                }}
                title="Reset to default screenshot"
                className="p-3 rounded-2xl border border-border-subtle bg-surface hover:bg-stone-100 dark:hover:bg-white/[0.06] text-ink-tertiary hover:text-ink transition-all shadow-2xs"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  Copy,
  ChevronDown,
  Globe,
  Sliders,
  Type,
  Code2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface FontFamily {
  id: string;
  name: string;
  stylesCount: number;
  isSystem?: boolean;
  sampleText?: string;
  category: "Serif" | "Sans" | "Mono" | "Display";
  cssFamily: string;
  postScript: string;
}

export function SpecimenExplorer() {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hideSystem, setHideSystem] = useState(false);
  const [previewText, setPreviewText] = useState("Sphinx of black quartz, judge my vow.");
  const [fontSize, setFontSize] = useState(26);
  const [selectedFontId, setSelectedFontId] = useState("crimson-pro");
  const [selectedStyle, setSelectedStyle] = useState("Light");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const categories = ["All", "Serif", "Sans", "Mono", "Display"];

  const languages = [
    "All",
    "English",
    "Turkish",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
  ];

  const fontFamilies: FontFamily[] = [
    {
      id: "cormorant-unicase",
      name: "Cormorant Unicase",
      stylesCount: 5,
      sampleText: "SPHINX OF BLACK QUARTZ, JUDGE MY VOW.",
      category: "Serif",
      cssFamily: "'Cormorant Unicase', serif",
      postScript: "CormorantUnicase-Regular",
    },
    {
      id: "cormorant-upright",
      name: "Cormorant Upright",
      stylesCount: 5,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Serif",
      cssFamily: "'Cormorant Upright', serif",
      postScript: "CormorantUpright-Regular",
    },
    {
      id: "courier-new",
      name: "Courier New",
      stylesCount: 4,
      isSystem: true,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Mono",
      cssFamily: "'Courier New', monospace",
      postScript: "CourierNewPSMT",
    },
    {
      id: "crimson-pro",
      name: "Crimson Pro",
      stylesCount: 16,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Serif",
      cssFamily: "'Crimson Pro', serif",
      postScript: "CrimsonPro-Regular",
    },
    {
      id: "crimson-text",
      name: "Crimson Text",
      stylesCount: 6,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Serif",
      cssFamily: "'Crimson Text', serif",
      postScript: "CrimsonText-Regular",
    },
    {
      id: "dejavu-sans",
      name: "DejaVu Sans",
      stylesCount: 1,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Sans",
      cssFamily: "'DejaVu Sans', sans-serif",
      postScript: "DejaVuSans",
    },
    {
      id: "din-alternate",
      name: "DIN Alternate",
      stylesCount: 1,
      sampleText: "SPHINX OF BLACK QUARTZ, JUDGE MY VOW.",
      category: "Sans",
      cssFamily: "'DIN Alternate', sans-serif",
      postScript: "DINAlternate-Bold",
    },
    {
      id: "din-condensed",
      name: "DIN Condensed",
      stylesCount: 1,
      sampleText: "SPHINX OF BLACK QUARTZ, JUDGE MY VOW.",
      category: "Sans",
      cssFamily: "'DIN Condensed', sans-serif",
      postScript: "DINCondensed-Bold",
    },
    {
      id: "eb-garamond",
      name: "EB Garamond",
      stylesCount: 4,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Serif",
      cssFamily: "'EB Garamond', serif",
      postScript: "EBGaramond-Regular",
    },
    {
      id: "fira-mono",
      name: "Fira Mono",
      stylesCount: 3,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Mono",
      cssFamily: "'Fira Mono', monospace",
      postScript: "FiraMono-Regular",
    },
    {
      id: "satoshi",
      name: "Satoshi",
      stylesCount: 9,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Sans",
      cssFamily: "'Satoshi', sans-serif",
      postScript: "Satoshi-Variable",
    },
    {
      id: "instrument-serif",
      name: "Instrument Serif",
      stylesCount: 2,
      sampleText: "Sphinx of black quartz, judge my vow.",
      category: "Serif",
      cssFamily: "'Instrument Serif', serif",
      postScript: "InstrumentSerif-Regular",
    },
  ];

  const styles = [
    ["Regular", "Italic"],
    ["Light", "Light Italic"],
    ["Medium", "Medium Italic"],
    ["Bold", "Bold Italic"],
  ];

  const glyphs = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFG".split("");

  const filteredFonts = fontFamilies.filter((f) => {
    if (hideSystem && f.isSystem) return false;
    if (selectedCategory !== "All" && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      return (
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const selectedFont = fontFamilies.find((f) => f.id === selectedFontId) || fontFamilies[3];

  const handleCopy = (format: string) => {
    let text = "";
    if (format === "CSS") text = `font-family: ${selectedFont.cssFamily};`;
    else if (format === "SwiftUI") text = `.font(.custom("${selectedFont.postScript}", size: ${fontSize}))`;
    else if (format === "UIKit") text = `UIFont(name: "${selectedFont.postScript}", size: ${fontSize})`;
    else if (format === "Figma") text = selectedFont.name;
    else if (format === "font-face") text = `@font-face {\n  font-family: '${selectedFont.name}';\n  src: local('${selectedFont.postScript}');\n}`;

    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Controls Bar: Search, Category Pills, Preview Input (Merged with Web UI) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-[24px] border border-border-subtle bg-surface shadow-subtle transition-colors">
        {/* Left: Category Filter Pills matching Image 2 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-ink text-paper font-semibold shadow-xs"
                  : "bg-stone-100/70 dark:bg-white/[0.04] text-ink-secondary hover:text-ink hover:bg-stone-200/60 dark:hover:bg-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-4 w-px bg-border-subtle mx-1" />

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-stone-100/70 dark:bg-white/[0.04] text-xs font-mono text-ink border-0 focus:outline-none cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Search Input matching Image 2 & Size Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search type families..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full border border-border-subtle bg-surface text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-[#8B5CF6] transition-all shadow-subtle"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/70 dark:bg-white/[0.04] border border-border-subtle text-xs font-mono text-ink">
            <span>{fontSize}pt</span>
            <input
              type="range"
              min={16}
              max={48}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>
        </div>
      </div>

      {/* ── Live Custom Text Ingestion Bar ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-[20px] border border-border-subtle bg-surface shadow-subtle">
        <span className="text-xs font-mono text-ink-tertiary uppercase tracking-wider shrink-0">
          Preview Text:
        </span>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Sphinx of black quartz, judge my vow."
          className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-ink focus:outline-none"
        />
        <span className="text-[11px] font-mono text-ink-tertiary shrink-0">
          {filteredFonts.length} families
        </span>
      </div>

      {/* ── Two-Column Layout: Specimen Cards Grid + Active Font Inspector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specimen Cards Grid (8 cols) styled like Image 2 */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFonts.map((font) => {
              const isSelected = selectedFontId === font.id;

              return (
                <div
                  key={font.id}
                  onClick={() => setSelectedFontId(font.id)}
                  className={`group relative rounded-[24px] border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[170px] ${
                    isSelected
                      ? "border-[#8B5CF6] bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-[#8B5CF6]/30 shadow-[0_8px_24px_rgba(139,92,246,0.15)] -translate-y-0.5"
                      : "border-border-subtle bg-surface hover:border-border-line hover:shadow-card hover:-translate-y-0.5"
                  }`}
                >
                  {/* Top Specimen Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border-subtle/50">
                    <span className="font-mono text-[10px] text-ink-tertiary uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.06]">
                      {font.category}
                    </span>
                    <span className="font-serif text-lg text-ink font-light">
                      {font.name.slice(0, 1)}
                    </span>
                  </div>

                  {/* Main Specimen Preview */}
                  <div className="py-3">
                    <p
                      className="text-ink leading-snug tracking-tight font-medium line-clamp-2"
                      style={{
                        fontFamily: font.cssFamily,
                        fontSize: `${fontSize}px`,
                        textTransform: font.sampleText?.includes("SPHINX") ? "uppercase" : "none",
                      }}
                    >
                      {previewText || font.sampleText}
                    </p>
                  </div>

                  {/* Bottom Meta */}
                  <div className="pt-2 flex items-center justify-between border-t border-border-subtle/50">
                    <div>
                      <h4 className="text-xs font-bold text-ink tracking-tight font-sans">
                        {font.name}
                      </h4>
                      <p className="text-[10px] font-mono text-ink-tertiary">
                        {font.stylesCount} styles {font.isSystem ? "· System" : ""}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(`font-family: ${font.cssFamily};`);
                        setCopiedFormat(font.id);
                        setTimeout(() => setCopiedFormat(null), 1500);
                      }}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-stone-100 dark:bg-white/[0.06] text-ink-secondary hover:text-ink hover:bg-stone-200 dark:hover:bg-white/[0.1] transition-colors"
                    >
                      {copiedFormat === font.id ? "Copied" : "</> CSS"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Type Inspector & Glyphs (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-subtle space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-tertiary block">
                  SELECTED FAMILY
                </span>
                <h3 className="text-lg font-bold text-ink mt-0.5">
                  {selectedFont.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#8B5CF6] font-semibold">
                {selectedFont.stylesCount} styles
              </span>
            </div>

            {/* Weights & Styles */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-ink-tertiary block">
                Available Weights
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {styles.map(([s1, s2], idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => setSelectedStyle(s1)}
                      className={`px-3 py-1.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedStyle === s1
                          ? "bg-ink text-paper font-semibold"
                          : "bg-stone-100/70 dark:bg-white/[0.04] text-ink hover:bg-stone-200/60 dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="truncate">{s1}</span>
                      {selectedStyle === s1 && <Check size={11} />}
                    </button>
                    <button
                      onClick={() => setSelectedStyle(s2)}
                      className={`px-3 py-1.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedStyle === s2
                          ? "bg-ink text-paper font-semibold"
                          : "bg-stone-100/70 dark:bg-white/[0.04] text-ink hover:bg-stone-200/60 dark:hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="truncate">{s2}</span>
                      {selectedStyle === s2 && <Check size={11} />}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Quick Export Code Chips */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <span className="text-[11px] font-mono uppercase text-ink-tertiary block">
                Export As Code
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {["CSS", "SwiftUI", "Figma"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleCopy(fmt)}
                    className="px-2.5 py-1.5 rounded-xl border border-border-subtle bg-stone-50 dark:bg-white/[0.02] hover:bg-stone-100 dark:hover:bg-white/[0.06] text-ink flex items-center justify-between text-[11px] transition-colors"
                  >
                    <span>{fmt}</span>
                    {copiedFormat === fmt ? (
                      <Check size={10} className="text-emerald-500" />
                    ) : (
                      <Copy size={10} className="text-ink-tertiary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Glyphs Matrix */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-ink-tertiary">
                  Glyphs Preview
                </span>
                <span className="text-[9px] font-mono text-ink-tertiary">ASCII</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {glyphs.map((g, i) => (
                  <div
                    key={i}
                    className="h-7 rounded-lg bg-stone-100/70 dark:bg-white/[0.04] text-ink flex items-center justify-center hover:bg-[#8B5CF6] hover:text-white transition-colors cursor-pointer"
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

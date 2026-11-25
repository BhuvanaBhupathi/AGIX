"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Smartphone,
  CreditCard,
  Package,
  Share2,
  FileText,
  Monitor,
  Mail,
  Sliders,
  Sparkles,
  Download,
  Copy,
  Check,
  Eye,
  Layers,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { BrandProject } from "@/lib/data";
import { WildApplicationContext, WildPreviewCustomization } from "@/lib/intelligence/types";

export default function BrandInTheWildPage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(null);

  // Active Application Context
  const [activeContext, setActiveContext] = useState<WildApplicationContext>("website");

  // Customization Controls
  const [headline, setHeadline] = useState("Architectural Clarity for the Next Era");
  const [subheadline, setSubheadline] = useState(
    "A unified creative workspace engineered for design directors, spatial thinkers, and visionary brands."
  );
  const [ctaText, setCtaText] = useState("Request Private Access");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Brand Palette state extracted from project
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [accentColor, setAccentColor] = useState("#38BDF8");
  const [bgColor, setBgColor] = useState("#08090E");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const proj = projects[0];
      setSelectedProject(proj);
      applyProjectBranding(proj);
    }
  }, [projects, selectedProject]);

  const applyProjectBranding = (proj: BrandProject) => {
    if (proj.colors && proj.colors.length > 0) {
      setPrimaryColor(proj.colors[0] || "#8B5CF6");
      setAccentColor(proj.colors[1] || "#38BDF8");
    }
    setHeadline(`The Definitive Standard in ${proj.type || "Brand Identity"}`);
    setSubheadline(
      proj.description ||
        `Crafting enduring visual systems and intentional physical applications for ${proj.client}.`
    );
  };

  const handleSelectProject = (project: BrandProject) => {
    setSelectedProject(project);
    applyProjectBranding(project);
  };

  const contexts: {
    id: WildApplicationContext;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    category: string;
  }[] = [
    { id: "website", label: "Web Landing Page", icon: Globe, category: "Digital" },
    { id: "mobile", label: "Mobile App Screen", icon: Smartphone, category: "Digital" },
    { id: "business_card", label: "Luxury Business Card", icon: CreditCard, category: "Print Collateral" },
    { id: "packaging", label: "Product Packaging", icon: Package, category: "Physical Product" },
    { id: "social", label: "Social Media Campaign", icon: Share2, category: "Marketing" },
    { id: "poster", label: "Typographic Poster", icon: FileText, category: "Environmental" },
    { id: "presentation", label: "Executive Pitch Slide", icon: Monitor, category: "Presentation" },
    { id: "stationery", label: "Corporate Stationery", icon: Mail, category: "Print Collateral" },
  ];

  const brandName = selectedProject?.name || "Aura Identity";
  const brandClient = selectedProject?.client || "Kinetic Media Labs";
  const monogram = brandName.slice(0, 2).toUpperCase();

  const handleCopyTokens = () => {
    const tokens = `/* AGIX Wild Preview Tokens: ${brandName} */\n--brand-primary: ${primaryColor};\n--brand-accent: ${accentColor};\n--brand-bg: ${isDarkMode ? "#08090E" : "#F8FAFC"};\n--brand-headline: "${headline}";`;
    navigator.clipboard.writeText(tokens);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#08090E] text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <ProjectSelectorHeader
          badge="FEATURE 07 · BRAND IN THE WILD"
          badgeIcon={<Sparkles size={13} className="text-[#8B5CF6]" />}
          title="Brand In The Wild"
          description="Interactive brand application preview suite. Test and validate your selected visual identity across 8 high-fidelity physical, digital, and environmental contexts."
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTokens}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#11131E] text-xs font-medium hover:border-[#8B5CF6]/50 transition-colors shadow-2xs"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Tokens Copied" : "Copy Brand Tokens"}</span>
              </button>
            </div>
          }
        />

        {/* Application Context Carousel Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {contexts.map((ctx) => {
            const Icon = ctx.icon;
            const isActive = activeContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => setActiveContext(ctx.id)}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/40"
                    : "bg-white dark:bg-[#0E1018] border border-black/[0.06] dark:border-white/[0.08] text-ink-secondary hover:text-ink hover:border-[#8B5CF6]/40"
                }`}
              >
                <Icon size={14} className={isActive ? "text-white" : "text-[#8B5CF6]"} />
                <span>{ctx.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Workspace Layout: Controls Sidebar + Canvas Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Sliders size={15} className="text-[#8B5CF6]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                    Preview Controllers
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-stone-100 dark:bg-white/[0.06] p-1 rounded-xl">
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      !isDarkMode
                        ? "bg-white text-ink shadow-2xs"
                        : "text-ink-tertiary hover:text-ink"
                    }`}
                    title="Light Theme Preview"
                  >
                    <Sun size={13} />
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode
                        ? "bg-ink text-white shadow-2xs"
                        : "text-ink-tertiary hover:text-ink"
                    }`}
                    title="Dark Obsidian Preview"
                  >
                    <Moon size={13} />
                  </button>
                </div>
              </div>

              {/* Editable Text Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-1.5">
                    Lead Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs font-medium text-ink focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-1.5">
                    Subheadline & Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs font-medium text-ink focus:outline-none focus:border-[#8B5CF6] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-1.5">
                    Call To Action Button
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs font-medium text-ink focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                {/* Color Swatch Overrides */}
                <div className="pt-2">
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-2">
                    Active Palette Harmonies
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-2 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-white/[0.02]">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <div className="text-[10px] font-mono">
                        <p className="font-semibold text-ink">Primary</p>
                        <p className="text-ink-tertiary">{primaryColor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-white/[0.02]">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                      />
                      <div className="text-[10px] font-mono">
                        <p className="font-semibold text-ink">Accent</p>
                        <p className="text-ink-tertiary">{accentColor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specimen Info Card */}
            <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-[#0B0C12] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-ink">
                <span>Rendering Specs</span>
                <span className="font-mono text-[10px] text-[#8B5CF6]">VECTOR REALTIME</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-ink-secondary dark:text-slate-400">
                <p>• Heading Typeface: Geometric Grotesk Display</p>
                <p>• Body Typeface: Neutral Modern Editorial Sans</p>
                <p>• Dynamic Contrast: Verified WCAG AAA Compliant</p>
              </div>
            </div>
          </div>

          {/* Interactive Mockup Canvas (8 cols) */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-200/50 dark:bg-[#07080D] p-6 lg:p-10 shadow-inner flex items-center justify-center min-h-[640px] overflow-hidden">
              {/* 1. WEBSITE LANDING PAGE */}
              {activeContext === "website" && (
                <div
                  className={`w-full max-w-2xl rounded-2xl shadow-2xl border transition-all duration-300 overflow-hidden ${
                    isDarkMode
                      ? "bg-[#0A0B12] text-white border-white/[0.1]"
                      : "bg-[#FFFFFF] text-slate-900 border-black/[0.08]"
                  }`}
                >
                  {/* Browser Chrome Header */}
                  <div
                    className={`px-4 py-3 border-b flex items-center justify-between ${
                      isDarkMode ? "bg-[#11131E] border-white/[0.06]" : "bg-stone-100 border-black/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <div
                      className={`px-6 py-1 rounded-full text-[11px] font-mono truncate max-w-[240px] ${
                        isDarkMode ? "bg-black/40 text-slate-400" : "bg-white text-slate-500"
                      }`}
                    >
                      https://{brandName.toLowerCase().replace(/\s+/g, "")}.studio
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* Landing Page Content */}
                  <div className="p-8 lg:p-10 space-y-8">
                    {/* Brand Navbar */}
                    <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-8 w-8 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md"
                          style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                        >
                          {monogram}
                        </div>
                        <span className="font-extrabold tracking-wider text-sm uppercase">
                          {brandName}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-slate-400">
                        <span>Manifesto</span>
                        <span>Works</span>
                        <span>Principles</span>
                        <span style={{ color: accentColor }}>Access</span>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="space-y-4 py-4 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/[0.05] border border-white/[0.1]">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                        <span>Curated by {brandClient}</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        {headline}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {subheadline}
                      </p>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-transform hover:scale-105"
                          style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                        >
                          {ctaText}
                        </button>
                        <button
                          className="px-4 py-2.5 rounded-xl font-medium text-xs border border-white/20 hover:bg-white/10"
                        >
                          Read Case Study
                        </button>
                      </div>
                    </div>

                    {/* Highlighted Feature Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div
                        className="p-4 rounded-xl border border-white/[0.08]"
                        style={{
                          background: isDarkMode
                            ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                            : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
                        }}
                      >
                        <div
                          className="h-2 w-10 rounded-full mb-3"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <h4 className="text-xs font-bold">Uncompromising Discipline</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Every spatial boundary calibrated to golden ratio proportions.
                        </p>
                      </div>
                      <div
                        className="p-4 rounded-xl border border-white/[0.08]"
                        style={{
                          background: isDarkMode
                            ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                            : "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)",
                        }}
                      >
                        <div
                          className="h-2 w-10 rounded-full mb-3"
                          style={{ backgroundColor: accentColor }}
                        />
                        <h4 className="text-xs font-bold">Tangible Materiality</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Seamlessly bridging luminous digital tokens with tactile print.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MOBILE APP SCREEN */}
              {activeContext === "mobile" && (
                <div
                  className={`w-72 rounded-[40px] p-4 shadow-2xl border-4 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#090A10] border-[#222436] text-white"
                      : "bg-white border-stone-300 text-slate-900"
                  }`}
                >
                  {/* Dynamic Island / Notch */}
                  <div className="flex justify-center mb-4">
                    <div className="h-4 w-24 rounded-full bg-black flex items-center justify-end px-2">
                      <span className="h-2 w-2 rounded-full bg-[#181926]" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between px-2 mb-5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[10px] text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {monogram}
                      </div>
                      <span className="font-extrabold text-xs tracking-wider uppercase">
                        {brandName}
                      </span>
                    </div>
                    <span
                      className="h-2 w-2 rounded-full animate-ping"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>

                  {/* Main App Hero Card */}
                  <div
                    className="p-4 rounded-2xl mb-4 relative overflow-hidden shadow-lg"
                    style={{
                      background: `linear-gradient(145deg, ${primaryColor}dd 0%, #1A1035 100%)`,
                      color: "#FFFFFF",
                    }}
                  >
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/70">
                      IDENTITY HUB
                    </span>
                    <h3 className="text-sm font-extrabold mt-1 leading-snug">
                      {headline.slice(0, 32)}...
                    </h3>
                    <p className="text-[10px] text-white/80 mt-1 line-clamp-2">
                      {subheadline}
                    </p>
                    <button
                      className="mt-3 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white text-slate-950 shadow-xs"
                    >
                      {ctaText}
                    </button>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 px-1">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[9px] font-mono text-slate-400">COHERENCE</p>
                      <p className="text-base font-extrabold mt-0.5" style={{ color: accentColor }}>
                        94.8%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <p className="text-[9px] font-mono text-slate-400">HARMONY</p>
                      <p className="text-base font-extrabold mt-0.5" style={{ color: primaryColor }}>
                        AAA
                      </p>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="mt-8 pt-3 border-t border-white/[0.08] flex items-center justify-around text-[10px] text-slate-400">
                    <span className="font-bold text-white">Board</span>
                    <span>Colors</span>
                    <span>DNA</span>
                    <span>Client</span>
                  </div>
                </div>
              )}

              {/* 3. LUXURY BUSINESS CARDS */}
              {activeContext === "business_card" && (
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Front Card */}
                  <div
                    className="w-80 h-48 rounded-2xl p-6 shadow-2xl border flex flex-col justify-between relative overflow-hidden transition-all"
                    style={{
                      backgroundColor: isDarkMode ? "#08090E" : "#FFFFFF",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md"
                        style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                      >
                        {monogram}
                      </div>
                      <span className="text-[9px] font-mono tracking-widest uppercase opacity-60">
                        EST. 2026
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold tracking-wider uppercase">
                        {brandName}
                      </h3>
                      <p className="text-[10px] font-mono opacity-70 tracking-widest mt-0.5">
                        {brandClient}
                      </p>
                    </div>
                  </div>

                  {/* Back Card */}
                  <div
                    className="w-80 h-48 rounded-2xl p-6 shadow-2xl border flex flex-col justify-between relative overflow-hidden transition-all"
                    style={{
                      backgroundColor: isDarkMode ? "#0F101A" : "#F8FAFC",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div>
                      <h4 className="text-xs font-bold">Bhuvana Bhupathi</h4>
                      <p className="text-[10px] font-mono opacity-70">Design Director & Founder</p>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono opacity-80">
                      <p>direct@studio.com</p>
                      <p>+1 (555) 092-4820</p>
                      <p className="font-semibold" style={{ color: primaryColor }}>
                        agix.workspace/{brandName.toLowerCase()}
                      </p>
                    </div>
                    <div
                      className="h-1 w-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* 4. PRODUCT PACKAGING */}
              {activeContext === "packaging" && (
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Luxury Box Mockup */}
                  <div
                    className="w-64 h-72 rounded-3xl p-6 shadow-2xl border flex flex-col justify-between relative"
                    style={{
                      backgroundColor: isDarkMode ? "#0B0C14" : "#FFFFFF",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase opacity-60">
                        VOL. 01 / 500 ML
                      </span>
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <div
                        className="h-14 w-14 mx-auto rounded-2xl flex items-center justify-center font-black text-xl shadow-lg"
                        style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                      >
                        {monogram}
                      </div>
                      <h3 className="text-lg font-extrabold tracking-widest uppercase">
                        {brandName}
                      </h3>
                      <p className="text-[10px] font-mono opacity-70">
                        ORGANIC EXTRACT NO. 4
                      </p>
                    </div>
                    <div className="text-center border-t border-white/10 pt-3">
                      <p className="text-[9px] font-mono tracking-widest opacity-60 uppercase">
                        CRAFTED FOR {brandClient.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Bottle / Can Mockup */}
                  <div
                    className="w-36 h-80 rounded-full p-4 shadow-2xl border flex flex-col justify-between items-center text-center relative"
                    style={{
                      backgroundColor: isDarkMode ? "#121422" : "#F1F5F9",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="w-12 h-2 rounded-full bg-white/20 mt-2" />
                    <div className="space-y-1">
                      <span
                        className="text-xs font-black tracking-widest block"
                        style={{ color: primaryColor }}
                      >
                        {monogram}
                      </span>
                      <p className="text-[9px] font-extrabold tracking-widest uppercase">
                        {brandName}
                      </p>
                    </div>
                    <p className="text-[8px] font-mono opacity-60 pb-3">EST. 2026</p>
                  </div>
                </div>
              )}

              {/* 5. SOCIAL MEDIA POSTS */}
              {activeContext === "social" && (
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Square Post (Instagram) */}
                  <div
                    className="w-72 h-72 rounded-2xl p-6 shadow-2xl border flex flex-col justify-between relative"
                    style={{
                      backgroundColor: isDarkMode ? "#08090E" : "#FFFFFF",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-lg flex items-center justify-center font-bold text-[9px] text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {monogram}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase">
                          {brandName}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono opacity-60">@studio</span>
                    </div>

                    <div className="space-y-2">
                      <p
                        className="text-xs font-mono uppercase tracking-widest"
                        style={{ color: accentColor }}
                      >
                        PERSPECTIVE
                      </p>
                      <h3 className="text-base font-extrabold leading-snug">
                        "{headline}"
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[9px] font-mono opacity-70">
                      <span>READ MANIFESTO</span>
                      <span style={{ color: primaryColor }}>SWIPE →</span>
                    </div>
                  </div>

                  {/* Vertical Story Format */}
                  <div
                    className="w-52 h-80 rounded-3xl p-5 shadow-2xl border flex flex-col justify-between relative"
                    style={{
                      background: `linear-gradient(180deg, ${isDarkMode ? "#0E101D" : "#F8FAFC"} 0%, ${
                        isDarkMode ? "#08090E" : "#EDE9FE"
                      } 100%)`,
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono uppercase tracking-widest opacity-60">
                        STORY 01
                      </span>
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <div
                        className="h-12 w-12 mx-auto rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md"
                        style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                      >
                        {monogram}
                      </div>
                      <h4 className="text-xs font-extrabold tracking-wide uppercase">
                        {brandName}
                      </h4>
                      <p className="text-[10px] opacity-75 line-clamp-3">
                        {subheadline}
                      </p>
                    </div>
                    <div className="text-center">
                      <button
                        className="px-3 py-1.5 rounded-full text-[9px] font-bold shadow-md"
                        style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                      >
                        {ctaText}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. POSTER */}
              {activeContext === "poster" && (
                <div
                  className="w-80 h-[480px] rounded-2xl p-8 shadow-2xl border flex flex-col justify-between relative"
                  style={{
                    backgroundColor: isDarkMode ? "#08090E" : "#FFFFFF",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                    color: isDarkMode ? "#FFFFFF" : "#08090E",
                  }}
                >
                  <div className="flex justify-between items-start border-b pb-4 border-white/10">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-widest opacity-60">
                        EXHIBITION POSTER NO. 07
                      </p>
                      <h2 className="text-xl font-black uppercase tracking-wider mt-1">
                        {brandName}
                      </h2>
                    </div>
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                    >
                      {monogram}
                    </div>
                  </div>

                  <div className="py-6 space-y-3">
                    <p
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{ color: accentColor }}
                    >
                      DESIGN SYSTEM SPECIFICATION
                    </p>
                    <h1 className="text-2xl font-black leading-tight uppercase">
                      {headline}
                    </h1>
                    <p className="text-xs opacity-75 leading-relaxed">
                      {subheadline}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex items-end justify-between">
                    <div className="text-[9px] font-mono opacity-60 space-y-0.5">
                      <p>COMMISSION: {brandClient.toUpperCase()}</p>
                      <p>LAT 37.7749° N, LONG 122.4194° W</p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                    >
                      ARCHIVAL
                    </div>
                  </div>
                </div>
              )}

              {/* 7. PRESENTATION SLIDES */}
              {activeContext === "presentation" && (
                <div
                  className="w-full max-w-2xl aspect-video rounded-2xl p-8 shadow-2xl border flex flex-col justify-between relative"
                  style={{
                    backgroundColor: isDarkMode ? "#0B0C15" : "#FFFFFF",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                    color: isDarkMode ? "#FFFFFF" : "#08090E",
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-4 border-white/10">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {monogram}
                      </div>
                      <span className="font-extrabold text-xs uppercase tracking-wider">
                        {brandName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono opacity-60">CONFIDENTIAL · 2026</span>
                  </div>

                  <div className="space-y-3 max-w-lg">
                    <span
                      className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                      style={{ color: accentColor }}
                    >
                      STRATEGIC VISION
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                      {headline}
                    </h2>
                    <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                      {subheadline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-mono opacity-70">
                    <span>{brandClient}</span>
                    <span>SLIDE 04 / 28</span>
                  </div>
                </div>
              )}

              {/* 8. MARKETING STATIONERY */}
              {activeContext === "stationery" && (
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* A4 Letterhead */}
                  <div
                    className="w-64 h-88 rounded-xl p-6 shadow-2xl border flex flex-col justify-between"
                    style={{
                      backgroundColor: isDarkMode ? "#08090E" : "#FFFFFF",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex justify-between items-start border-b pb-3 border-white/10">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">
                          {brandName}
                        </h4>
                        <p className="text-[8px] font-mono opacity-60">{brandClient}</p>
                      </div>
                      <div
                        className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {monogram}
                      </div>
                    </div>

                    <div className="space-y-2 py-4 text-[9px] leading-relaxed opacity-80">
                      <p className="font-semibold">{headline}</p>
                      <p>{subheadline}</p>
                      <div className="space-y-1 pt-2 opacity-60">
                        <div className="h-1.5 w-full bg-current rounded-full opacity-30" />
                        <div className="h-1.5 w-4/5 bg-current rounded-full opacity-30" />
                        <div className="h-1.5 w-2/3 bg-current rounded-full opacity-30" />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2 text-[8px] font-mono opacity-60 flex justify-between">
                      <span>OFFICIAL CORRESPONDENCE</span>
                      <span>PAGE 1 OF 1</span>
                    </div>
                  </div>

                  {/* Envelope */}
                  <div
                    className="w-72 h-44 rounded-xl p-5 shadow-2xl border flex flex-col justify-between"
                    style={{
                      backgroundColor: isDarkMode ? "#0F101A" : "#F8FAFC",
                      borderColor: isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
                      color: isDarkMode ? "#FFFFFF" : "#08090E",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5 w-5 rounded-md flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {monogram}
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">
                        {brandName}
                      </span>
                    </div>

                    <div className="pl-6 border-l-2 text-[9px] font-mono opacity-80" style={{ borderColor: accentColor }}>
                      <p className="font-bold">TO: EXECUTIVE DIRECTORS</p>
                      <p>KINETIC MEDIA LABS</p>
                      <p>100 CREATIVE PLAZA, CA</p>
                    </div>

                    <div
                      className="h-1 w-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

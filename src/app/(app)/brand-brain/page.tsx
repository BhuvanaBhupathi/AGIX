"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Sparkles,
  FileText,
  Edit3,
  Check,
  Copy,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
  Plus,
  RefreshCw,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { BrandProject } from "@/lib/data";
import { BrandBlueprint, BlueprintSection } from "@/lib/intelligence/types";
import { generateBlueprintFromBrief } from "@/lib/intelligence/ai-engine";

export default function BrandBrainPage() {
  const router = useRouter();
  const { projects, createProject, updateBrandBrain } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(null);

  // Raw Brief State
  const [clientName, setClientName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [rawBrief, setRawBrief] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Generated Blueprint State
  const [blueprint, setBlueprint] = useState<BrandBlueprint | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      const proj = projects[0];
      setSelectedProject(proj);
      setClientName(proj.client || "Kinetic Media Labs");
      setBrandName(proj.name || "Aura Spatial Identity");
      setRawBrief(
        `Client Questionnaire & Project Scope:\nBrand: ${proj.name}\nClient: ${proj.client}\nIndustry: Creative Technology & Next-Gen Spatial Computing\nGoal: Build an iconic, architectural brand identity that establishes immediate visual dominance. Avoid generic corporate blues or cartoonish tech gradients. The visual language should be deep obsidian (#08090E), subtle ultraviolet (#8B5CF6), high-contrast geometric typography, and generous negative space.\nTarget Audience: Design directors, architects, and luxury technology consumers.`
      );
    }
  }, [projects, selectedProject]);

  const handleSelectProject = (project: BrandProject) => {
    setSelectedProject(project);
    setClientName(project.client);
    setBrandName(project.name);
    setRawBrief(
      `Project Brief for ${project.name} (${project.client}):\nDescription: ${
        project.description || "Next-generation brand identity design"
      }\nInitial objectives: Create a coherent visual language that scales from digital spatial apps to tangible luxury print collateral.`
    );
  };

  const handleGenerateBlueprint = async () => {
    if (!brandName.trim() || !clientName.trim() || !rawBrief.trim()) {
      alert("Please provide the Client Name, Brand Name, and raw brief text.");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateBlueprintFromBrief(clientName, brandName, rawBrief);
      setBlueprint(generated);
    } catch (err) {
      console.error("Blueprint generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartEdit = (section: BlueprintSection) => {
    setEditingSectionId(section.id);
    setEditContent(section.content);
  };

  const handleSaveEdit = (sectionId: string) => {
    if (!blueprint) return;
    setBlueprint({
      ...blueprint,
      sections: blueprint.sections.map((s) =>
        s.id === sectionId ? { ...s, content: editContent } : s
      ),
      updatedAt: new Date().toISOString(),
    });
    setEditingSectionId(null);
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditContent("");
  };

  const handleSyncWithProject = () => {
    if (!blueprint || !selectedProject) return;

    const brandBrainUpdate = {
      story: blueprint.sections.find((s) => s.category === "brand_overview")?.content || "",
      mission: blueprint.sections.find((s) => s.category === "business_objectives")?.content || "",
      audience: blueprint.sections.find((s) => s.category === "target_audience")?.content || "",
      positioning: blueprint.sections.find((s) => s.category === "brand_positioning")?.content || "",
      personality: ["Architectural", "Visionary", "Minimalist", "High-Contrast"],
      tone: blueprint.sections.find((s) => s.category === "brand_personality")?.content || "",
      shouldFeelLike: ["Elevated", "Structured", "Intentional", "Monolithic"],
      shouldNotFeelLike: ["Cluttered", "Generic", "Playful", "Inconsistent"],
    };

    updateBrandBrain(selectedProject.id, brandBrainUpdate as any);
    setSaveSuccessMsg(`Successfully synced 12 strategic blueprint pillars into "${selectedProject.name}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleConvertToProject = () => {
    if (!blueprint) return;

    const newProj = createProject({
      name: blueprint.brandName,
      client: blueprint.clientName,
      type: "Brand Identity & Design System",
      description: blueprint.sections.find((s) => s.category === "brand_overview")?.content,
      notes: blueprint.rawClientInput,
    });

    setSaveSuccessMsg(`Created new project "${newProj.name}"! Redirecting to canvas...`);
    setTimeout(() => {
      router.push(`/project/${newProj.id}`);
    }, 1200);
  };

  const handleCopyMarkdown = () => {
    if (!blueprint) return;
    let md = `# Brand Blueprint: ${blueprint.brandName} (${blueprint.clientName})\n\n`;
    blueprint.sections.forEach((s, idx) => {
      md += `### ${idx + 1}. ${s.title} [${s.isAiInterpretation ? "AI Interpretation" : "Verbatim Client Data"}]\n`;
      md += `${s.content}\n\n`;
      if (s.verbatimClientNotes) {
        md += `> Verbatim Client Source: "${s.verbatimClientNotes}"\n\n`;
      }
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredSections = blueprint
    ? activeCategory === "all"
      ? blueprint.sections
      : blueprint.sections.filter((s) => s.category === activeCategory)
    : [];

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#08090E] text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <ProjectSelectorHeader
          badge="FEATURE 09 · BRIEF TO BLUEPRINT"
          badgeIcon={<Brain size={13} className="text-[#8B5CF6]" />}
          title="Brand Brain Intelligence"
          description="Transform unstructured client documents, interview notes, and briefs into an architectural 12-section strategic brand blueprint with explicit verbatim vs AI grounding."
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          actions={
            blueprint && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#11131E] text-xs font-medium hover:border-[#8B5CF6]/50 transition-colors shadow-2xs"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied Markdown" : "Export Markdown"}</span>
                </button>
                <button
                  onClick={handleSyncWithProject}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
                >
                  <Sparkles size={13} />
                  <span>Sync to Active Project</span>
                </button>
              </div>
            )
          }
        />

        {saveSuccessMsg && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fadeIn">
            <Check size={16} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Two-Column Workspace: Brief Input vs Blueprint View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Brief Input Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center text-[#8B5CF6]">
                    <FileText size={15} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                    Raw Client Ingestion
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.06] text-ink-tertiary">
                  Raw Source Data
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-1.5">
                    Client or Studio Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Kinetic Media Labs"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs font-medium text-ink focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400 mb-1.5">
                    Brand or Initiative Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Aura Spatial Identity"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs font-medium text-ink focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-mono uppercase text-ink-secondary dark:text-slate-400">
                      Client Brief, Transcripts & Notes
                    </label>
                    <span className="text-[10px] font-mono text-ink-tertiary">
                      {rawBrief.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    value={rawBrief}
                    onChange={(e) => setRawBrief(e.target.value)}
                    placeholder="Paste unedited email threads, client kickoff notes, questionnaire answers, or strategy transcripts..."
                    className="w-full px-3.5 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs text-ink font-mono focus:outline-none focus:border-[#8B5CF6] leading-relaxed resize-y"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    onClick={handleGenerateBlueprint}
                    disabled={isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#6366F1] text-white text-xs font-bold shadow-lg shadow-purple-500/25 hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Synthesizing Strategic Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Synthesize Brand Blueprint</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-ink-tertiary">
                    Distinguishes verbatim client statements from synthesized creative positioning.
                  </p>
                </div>
              </div>
            </div>

            {/* Ingestion Transparency Notice */}
            <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-[#0B0C12] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                <ShieldCheck size={14} className="text-[#8B5CF6]" />
                <span>Explainable Grounding Principle</span>
              </div>
              <p className="text-[11px] text-ink-secondary dark:text-slate-400 leading-relaxed">
                AGIX preserves your unedited client submissions side-by-side with AI-synthesized direction. Every section is fully editable and auditable so client intentions never get lost in translation.
              </p>
            </div>
          </div>

          {/* Right Column: 12-Section Strategic Blueprint */}
          <div className="lg:col-span-7 space-y-6">
            {!blueprint ? (
              /* Empty State */
              <div className="rounded-3xl border border-dashed border-black/[0.1] dark:border-white/[0.1] p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 flex items-center justify-center text-[#8B5CF6]">
                  <Brain size={28} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">No Blueprint Synthesized Yet</h3>
                  <p className="text-xs text-ink-secondary dark:text-slate-400 max-w-sm mt-1">
                    Provide the client information on the left and click "Synthesize Brand Blueprint" to generate the 12 architectural pillars.
                  </p>
                </div>
                <button
                  onClick={handleGenerateBlueprint}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-100 dark:bg-white/[0.08] hover:bg-stone-200 dark:hover:bg-white/[0.12] text-xs font-semibold text-ink transition-colors"
                >
                  <Sparkles size={13} className="text-[#8B5CF6]" />
                  <span>Synthesize with Sample Brief</span>
                </button>
              </div>
            ) : (
              /* Active Blueprint Console */
              <div className="space-y-6">
                {/* Blueprint Header & Quick Stats */}
                <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                          Blueprint Active & Verified
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-ink mt-1">
                        {blueprint.brandName}
                      </h2>
                      <p className="text-xs text-ink-secondary dark:text-slate-400">
                        Client Partner: {blueprint.clientName} · 12 Strategic Pillars
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleConvertToProject}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs font-semibold text-[#8B5CF6] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Plus size={13} />
                        <span>Convert to Project</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="pt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActiveCategory("all")}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                        activeCategory === "all"
                          ? "bg-ink text-paper"
                          : "bg-stone-100 dark:bg-white/[0.05] text-ink-secondary hover:text-ink"
                      }`}
                    >
                      All 12 Pillars
                    </button>
                    {[
                      { id: "brand_overview", label: "Overview" },
                      { id: "business_objectives", label: "Objectives" },
                      { id: "target_audience", label: "Audience" },
                      { id: "brand_positioning", label: "Positioning" },
                      { id: "color_direction", label: "Colors" },
                      { id: "typography_direction", label: "Typography" },
                      { id: "deliverables", label: "Deliverables" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                          activeCategory === cat.id
                            ? "bg-ink text-paper"
                            : "bg-stone-100 dark:bg-white/[0.05] text-ink-secondary hover:text-ink"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 12 Sections List */}
                <div className="space-y-4">
                  {filteredSections.map((section, idx) => {
                    const isEditing = editingSectionId === section.id;

                    return (
                      <div
                        key={section.id}
                        className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-5 shadow-2xs transition-all hover:border-[#8B5CF6]/30"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/[0.06] text-ink-tertiary">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <h3 className="text-sm font-bold text-ink tracking-tight">
                              {section.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Provenance Badge */}
                            {section.isAiInterpretation ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#8B5CF6] text-[10px] font-mono">
                                <Bot size={11} />
                                <span>AI Interpretation</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                                <User size={11} />
                                <span>Verbatim Client Source</span>
                              </span>
                            )}

                            {!isEditing && (
                              <button
                                onClick={() => handleStartEdit(section)}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-ink-tertiary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.08] transition-colors"
                                title="Edit section content"
                              >
                                <Edit3 size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Section Content: Edit or View */}
                        {isEditing ? (
                          <div className="space-y-3 pt-2">
                            <textarea
                              rows={4}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#8B5CF6] bg-stone-50 dark:bg-[#131520] text-xs text-ink font-mono focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 rounded-lg text-xs text-ink-secondary hover:text-ink"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(section.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold"
                              >
                                <Check size={12} />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        )}

                        {/* Verbatim client note snippet if available */}
                        {section.verbatimClientNotes && !isEditing && (
                          <div className="mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04] flex items-start gap-2 text-[11px] text-ink-tertiary">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-secondary">
                              Client Source:
                            </span>
                            <span className="italic truncate">"{section.verbatimClientNotes}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

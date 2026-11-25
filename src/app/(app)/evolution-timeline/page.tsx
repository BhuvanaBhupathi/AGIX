"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  History,
  GitCommit,
  Sparkles,
  RotateCcw,
  Plus,
  Bookmark,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  MessageSquare,
  FileCheck,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import type { TimelineMilestone, TimelineEventType } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { safeStorage } from "@/lib/safe-storage";

export default function EvolutionTimelinePage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects, updateProjectCanvas } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [filterType, setFilterType] = useState<string>("All");
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRationale, setNewRationale] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Seed or load timeline milestones per project
  useEffect(() => {
    if (selectedProject) {
      const storageKey = `agix_timeline_${selectedProject.id}`;
      const saved = safeStorage.get<TimelineMilestone[]>(storageKey, []);

      if (saved.length > 0) {
        setMilestones(saved);
      } else {
        const defaultMilestones: TimelineMilestone[] = [
          {
            id: `ms-1-${selectedProject.id}`,
            projectId: selectedProject.id,
            timestamp: "3 days ago",
            type: "reference_added",
            title: "Initial Inspiration Ingestion",
            description: "Imported 6 high-contrast architectural references and Swiss poster scans.",
            author: "Bhupathi",
            decisionRationale: "Establishing a foundation grounded in geometric restraint and spatial tension.",
            tags: ["Inspiration", "Architectural"],
            snapshot: {
              canvasObjectsCount: 6,
              palette: ["#08090E", "#F8FAFC"],
              fontSpecimen: "Satoshi",
            },
          },
          {
            id: `ms-2-${selectedProject.id}`,
            projectId: selectedProject.id,
            timestamp: "Yesterday",
            type: "color_change",
            title: "Chromatic Signal Calibration",
            description: "Shifted secondary accent from saturated indigo to luminous atmospheric violet (#8B5CF6).",
            author: "Bhupathi",
            decisionRationale: "Higher contrast against the obsidian background without visually fatiguing user focus.",
            tags: ["Palette", "Color DNA"],
            snapshot: {
              canvasObjectsCount: 9,
              palette: ["#08090E", "#8B5CF6", "#38BDF8"],
              fontSpecimen: "Satoshi",
            },
          },
          {
            id: `ms-3-${selectedProject.id}`,
            projectId: selectedProject.id,
            timestamp: "Today",
            type: "ai_recommendation",
            title: "Brand Coherence Review",
            description: "AI Coherence Engine suggested locking display letter-spacing at -0.025em.",
            author: "AGIX Intelligence",
            decisionRationale: "Improves readability of all caps metadata badges and aligns with Brand Brain traits.",
            tags: ["Typography", "Coherence"],
            snapshot: {
              canvasObjectsCount: selectedProject.canvasObjects?.length || 12,
              palette: selectedProject.visualPreview?.palette || ["#08090E", "#8B5CF6"],
              fontSpecimen: selectedProject.visualPreview?.fontSpecimen || "Satoshi",
            },
          },
        ];
        setMilestones(defaultMilestones);
        safeStorage.set(storageKey, defaultMilestones);
      }
    }
  }, [selectedProject]);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedProject) return;

    const newEntry: TimelineMilestone = {
      id: `ms-${Date.now()}`,
      projectId: selectedProject.id,
      timestamp: "Just now",
      type: "decision_milestone",
      title: newTitle.trim(),
      description: "Designer milestone logged directly in studio timeline.",
      author: "Bhupathi",
      decisionRationale: newRationale.trim() || "Strategic direction checkpoint.",
      tags: ["Milestone", "Designer Decision"],
      snapshot: {
        canvasObjectsCount: selectedProject.canvasObjects?.length || 1,
        palette: selectedProject.visualPreview?.palette || ["#08090E"],
        fontSpecimen: selectedProject.visualPreview?.fontSpecimen || "Satoshi",
      },
    };

    const updated = [newEntry, ...milestones];
    setMilestones(updated);
    safeStorage.set(`agix_timeline_${selectedProject.id}`, updated);
    setNewTitle("");
    setNewRationale("");
    setIsAddingMilestone(false);
    notify("Milestone recorded in evolution timeline.");
  };

  const handleRestoreMilestone = (ms: TimelineMilestone) => {
    notify(`Restored checkpoint: "${ms.title}" (Snapshot assets ready)`);
  };

  const filtered = milestones.filter((m) => {
    if (filterType === "All") return true;
    return m.type.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <ProjectSelectorHeader
        badge="Evolution Tracking"
        badgeIcon={<History size={13} className="text-[#8B5CF6]" />}
        title="Creative Evolution Timeline"
        description="Versioned chronological milestone history tracking reference changes, palette shifts, typography iterations, and the strategic rationale behind every creative decision."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
        actions={
          <button
            type="button"
            onClick={() => setIsAddingMilestone(!isAddingMilestone)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white text-xs font-medium hover:bg-black dark:hover:bg-[#7C3AED] transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={13} />
            <span>Record Milestone</span>
          </button>
        }
      />

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check size={14} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Add Milestone Inline Drawer */}
      {isAddingMilestone && (
        <form
          onSubmit={handleAddMilestone}
          className="p-6 rounded-[26px] border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#0E1018]/95 space-y-4 shadow-lifted animate-in fade-in"
        >
          <h4 className="text-sm font-bold text-ink">Record Creative Milestone Checkpoint</h4>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-ink-tertiary mb-1">Milestone Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Approved Final Monogram & Primary Palette Lock"
                className="w-full h-9 px-3 rounded-lg border border-border-subtle bg-surface-subtle text-ink outline-none focus:border-[#8B5CF6]"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-ink-tertiary mb-1">
                Strategic Decision Rationale (Why this decision changed/settled)
              </label>
              <textarea
                value={newRationale}
                onChange={(e) => setNewRationale(e.target.value)}
                placeholder="Explain the client feedback, creative shift, or why this decision was chosen over earlier alternatives..."
                rows={2}
                className="w-full p-3 rounded-lg border border-border-subtle bg-surface-subtle text-ink outline-none focus:border-[#8B5CF6] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingMilestone(false)}
              className="px-3.5 py-1.5 rounded-full border border-border-subtle text-xs text-ink hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white text-xs font-medium shadow-sm"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline Controls & Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs backdrop-blur-xs overflow-x-auto">
          {["All", "Reference", "Color", "Typography", "Milestone", "AI"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all text-xs ${
                filterType === tab
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-sm font-semibold border border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink hover:bg-white/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-ink-tertiary">
          Tracking {milestones.length} Historical Checkpoints
        </span>
      </div>

      {/* Visual Timeline Spine */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#8B5CF6] before:via-[#38BDF8]/50 before:to-transparent">
        {filtered.map((ms) => (
          <div key={ms.id} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-6 sm:-left-8 top-5 h-6 w-6 rounded-full bg-white dark:bg-[#08090E] border-2 border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6] shadow-sm -translate-x-1/2 group-hover:scale-125 transition-transform">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
            </div>

            {/* Milestone Card */}
            <div className="p-6 rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 space-y-4 shadow-2xs hover:border-[#8B5CF6]/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-[#8B5CF6] uppercase bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      {ms.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-mono text-ink-tertiary">
                      {ms.timestamp} · by {ms.author}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink mt-1">{ms.title}</h3>
                </div>

                {/* Restore / Snapshot Actions */}
                <button
                  type="button"
                  onClick={() => handleRestoreMilestone(ms)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-white/[0.04] text-xs font-medium text-ink hover:border-[#8B5CF6]/50 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Restore Version</span>
                </button>
              </div>

              <p className="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed">
                {ms.description}
              </p>

              {/* Decision Rationale Callout */}
              {ms.decisionRationale && (
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-500/20 text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#6D28D9] dark:text-[#C4B5FD]">
                    Strategic Decision Rationale:
                  </span>
                  <p className="text-ink-secondary dark:text-slate-300">{ms.decisionRationale}</p>
                </div>
              )}

              {/* Snapshot Assets Preview */}
              {ms.snapshot && (
                <div className="pt-2 flex items-center gap-4 flex-wrap text-xs font-mono text-ink-tertiary border-t border-black/[0.04] dark:border-white/[0.04]">
                  <span>Snapshot: {ms.snapshot.canvasObjectsCount} canvas assets</span>
                  <span>Font: {ms.snapshot.fontSpecimen}</span>
                  <div className="flex items-center gap-1">
                    {ms.snapshot.palette.map((c, i) => (
                      <span key={i} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

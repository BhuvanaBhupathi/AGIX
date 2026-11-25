"use client";

import React, { useState } from "react";
import { Plus, Search, Layers, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { useProjects } from "@/lib/projects-context";
import { NewProjectModal } from "@/components/project/NewProjectModal";

export default function ProjectsPage() {
  const { projects, deleteProject } = useProjects();
  const [activeTab, setActiveTab] = useState<"All" | "Active" | "Draft">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesTab =
      activeTab === "All"
        ? true
        : activeTab === "Active"
        ? p.status === "Active"
        : p.status === "Draft";

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="relative space-y-8 max-w-6xl">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header Area */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Layers size={12} />
            <span>Workspace Repository</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Projects <span className="text-ink-tertiary dark:text-slate-400 font-normal text-2xl font-mono">({projects.length})</span>
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            All your brand workspaces, visual identities, and studio archives in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] dark:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-[1px] active:translate-y-0 border border-purple-500/25 ring-1 ring-white/10 shrink-0"
          >
            <Plus size={15} className="text-purple-300 dark:text-white transition-transform duration-300 group-hover:rotate-90" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] w-fit backdrop-blur-xs">
          {(["All", "Active", "Draft"] as const).map((tab) => {
            const count =
              tab === "All"
                ? projects.length
                : projects.filter((p) => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                    : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span>{tab}</span>
                <span className="ml-1.5 text-[11px] text-ink-tertiary dark:text-slate-400 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary dark:text-slate-400"
          />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white dark:bg-[#121422] text-ink dark:text-white rounded-full border border-black/[0.06] dark:border-white/[0.08] placeholder:text-ink-tertiary dark:placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Projects Grid or Empty States */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectPreview
              key={project.id}
              project={project}
              onDelete={(id, name) => setProjectToDelete({ id, name })}
            />
          ))}

          {/* Quick Add Project Card */}
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="group rounded-[24px] border border-dashed border-black/[0.12] dark:border-white/[0.12] hover:border-[#8B5CF6]/50 bg-white/60 dark:bg-[#0E1018]/50 hover:bg-gradient-to-b hover:from-white hover:to-purple-50/30 dark:hover:from-[#0E1018] dark:hover:to-[#17192C] p-6 flex flex-col items-center justify-center min-h-[280px] transition-all duration-300 text-center cursor-pointer hover:shadow-[0_12px_28px_rgba(139,92,246,0.12)] hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-2xl bg-stone-100/80 dark:bg-white/[0.06] group-hover:bg-[#181126] dark:group-hover:bg-[#8B5CF6] border border-black/[0.04] dark:border-white/[0.08] flex items-center justify-center text-ink-secondary dark:text-slate-300 group-hover:text-purple-300 dark:group-hover:text-white transition-all duration-300 mb-3.5 shadow-2xs group-hover:scale-105">
              <Plus size={18} />
            </div>
            <p className="text-sm font-semibold text-ink group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">
              New Brand Workspace
            </p>
            <p className="text-xs text-ink-tertiary dark:text-slate-400 mt-1 max-w-[200px]">
              Set up a canvas for palettes, typography, and moodboards
            </p>
          </button>
        </div>
      ) : (
        <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-12 text-center">
          <Layers size={32} className="mx-auto text-ink-tertiary dark:text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-ink">No projects match criteria</h3>
          <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No project or client matches "${searchQuery}". Try a different keyword.`
              : `No projects found in "${activeTab}" tab.`}
          </p>
          <div className="mt-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("All");
                setSearchQuery("");
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0E1018] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
                <h3 className="font-semibold text-base text-ink">Delete Project</h3>
              </div>
              <button
                onClick={() => setProjectToDelete(null)}
                className="text-ink-tertiary hover:text-ink dark:hover:text-white p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-ink-secondary dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-ink font-semibold">{projectToDelete.name}</strong>? This will permanently remove its canvases, assets, and design data from your Agix workspace.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md text-xs px-3 h-8 gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-subtle cursor-pointer"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
}

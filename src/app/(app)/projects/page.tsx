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
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60" />

      {/* Header Area */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-black/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-200/60 text-[11px] font-mono text-[#6D28D9] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Layers size={12} />
            <span>Workspace Repository</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-ink">
            Projects <span className="text-ink-tertiary font-normal text-2xl font-mono">({projects.length})</span>
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            All your brand workspaces, visual identities, and studio archives in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.25)] hover:-translate-y-[1px] active:translate-y-0 border border-purple-500/25 ring-1 ring-white/10 shrink-0"
          >
            <Plus size={15} className="text-purple-300 transition-transform duration-300 group-hover:rotate-90" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 border border-black/[0.04] w-fit backdrop-blur-xs">
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
                    ? "bg-white text-ink shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80"
                    : "text-ink-secondary hover:text-ink hover:bg-white/50"
                }`}
              >
                <span>{tab}</span>
                <span className="ml-1.5 text-[11px] text-ink-tertiary font-mono">
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary"
          />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white rounded-full border border-black/[0.06] placeholder:text-ink-tertiary focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none transition-all shadow-2xs"
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
            className="group rounded-[26px] border border-dashed border-black/[0.12] hover:border-[#8B5CF6]/50 bg-white/60 hover:bg-gradient-to-b hover:from-white hover:to-purple-50/30 p-6 flex flex-col items-center justify-center min-h-[280px] transition-all duration-300 text-center cursor-pointer hover:shadow-[0_12px_28px_rgba(139,92,246,0.08)] hover:-translate-y-1"
          >
            <div className="h-12 w-12 rounded-2xl bg-stone-100/80 group-hover:bg-[#181126] border border-black/[0.04] flex items-center justify-center text-ink-secondary group-hover:text-purple-300 transition-all duration-300 mb-3.5 shadow-2xs group-hover:scale-105">
              <Plus size={18} />
            </div>
            <p className="text-sm font-semibold text-ink group-hover:text-[#6D28D9] transition-colors">New Brand Workspace</p>
            <p className="text-xs text-ink-tertiary mt-1 max-w-[200px] leading-relaxed">
              Start an exploratory canvas, typography study, or identity system.
            </p>
          </button>
        </div>
      ) : projects.length === 0 ? (
        /* Zero Projects Initial State */
        <div className="rounded-xl border border-dashed border-border-subtle bg-surface/50 p-16 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-surface-muted flex items-center justify-center text-ink-tertiary mb-4">
            <Layers size={22} />
          </div>
          <h3 className="text-base font-semibold text-ink">No projects yet</h3>
          <p className="mt-1 text-xs text-ink-secondary max-w-sm mx-auto leading-relaxed">
            Your brand workspaces, identity systems, and typography studies will live here.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="mt-5 inline-flex items-center gap-1.5"
          >
            <Plus size={14} className="text-white" />
            <span className="text-white font-medium">Create your first project</span>
          </Button>
        </div>
      ) : (
        /* No search matches */
        <div className="rounded-xl border border-border-subtle bg-surface p-12 text-center">
          <p className="text-sm font-medium text-ink">No projects match your filter</p>
          <p className="text-xs text-ink-secondary mt-1">
            Try adjusting your search query or status filter.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setActiveTab("All");
              setSearchQuery("");
            }}
            className="mt-4"
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* 3-Step Full Flow Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-subtle bg-surface p-6 shadow-lifted">
            <div className="flex items-center gap-2.5 text-red-600 mb-3">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-semibold tracking-tight text-ink">
                Delete Project
              </h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-ink">&ldquo;{projectToDelete.name}&rdquo;</span>? This will permanently remove its canvas, Brand Brain, and all exploratory materials.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={confirmDelete}
                className="h-8 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Delete project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

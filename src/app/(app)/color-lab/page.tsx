"use client";

import React, { useState } from "react";
import { CanvaColorWheel } from "@/components/color-lab/CanvaColorWheel";
import { OklchColorLab } from "@/components/color-lab/OklchColorLab";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { useProjects } from "@/lib/projects-context";
import { Palette, Disc, Layers } from "lucide-react";

export default function ColorLabPage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [activeTab, setActiveTab] = useState<"wheel" | "spectral">("wheel");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ProjectSelectorHeader
        badge="COLOR LAB · HARMONY & SPECTRAL MATRIX"
        badgeIcon={<Palette size={13} className="text-[#8B5CF6]" />}
        title="Color Lab"
        description="Interactive color wheel harmony generator with exact hex codes, complementary pairing, and wide-gamut spectral scales."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        actions={
          <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs backdrop-blur-xs">
            <button
              onClick={() => setActiveTab("wheel")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
                activeTab === "wheel"
                  ? "bg-white dark:bg-white/10 text-ink shadow-xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <Disc size={13} className={activeTab === "wheel" ? "text-[#8B5CF6]" : ""} />
              <span>Color Wheel</span>
            </button>
            <button
              onClick={() => setActiveTab("spectral")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all ${
                activeTab === "spectral"
                  ? "bg-white dark:bg-white/10 text-ink shadow-xs font-semibold"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              <Layers size={13} className={activeTab === "spectral" ? "text-[#EC4899]" : ""} />
              <span>OKLCH Spectral Lab</span>
            </button>
          </div>
        }
      />

      {activeTab === "wheel" ? <CanvaColorWheel /> : <OklchColorLab />}
    </div>
  );
}

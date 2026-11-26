"use client";

import React from "react";
import { SpecimenExplorer } from "@/components/creative-lab/SpecimenExplorer";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { useProjects } from "@/lib/projects-context";
import { Type } from "lucide-react";

export default function TypographyPage() {
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = React.useState(projects[0] || null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ProjectSelectorHeader
        badge="CREATIVE LAB · SPECIMEN EXPLORER"
        badgeIcon={<Type size={13} className="text-[#8B5CF6]" />}
        title="Creative Lab: Typography"
        description="Explore, compare, and stress-test high-fashion type families, styles, OpenType glyphs, and code snippets in real-time."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />

      <SpecimenExplorer />
    </div>
  );
}

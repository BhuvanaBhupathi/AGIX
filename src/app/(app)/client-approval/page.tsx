"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Lock,
  Unlock,
  Eye,
  Send,
  User,
  History,
  FileCheck,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { BrandProject, ReviewShare, Approval, Comment } from "@/lib/data";

export default function ClientApprovalPage() {
  const {
    projects,
    reviewShares,
    createReviewShare,
    deactivateShare,
    getSharesForProject,
    approvals,
    comments,
    addComment,
  } = useProjects();

  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedDirection, setSelectedDirection] = useState<string>("dir-1");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [linkSuccessMsg, setLinkSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const activeProjectShares = selectedProject
    ? getSharesForProject(selectedProject.id)
    : [];

  const handleCreateShare = () => {
    if (!selectedProject) return;
    setIsGeneratingLink(true);

    try {
      const share = createReviewShare({
        projectId: selectedProject.id,
        directionId: "dir-1",
        accessLevel: "COMMENT",
      });

      setLinkSuccessMsg(`Created secure client review link! Token: ${share.token}`);
      setTimeout(() => setLinkSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Failed to create share:", err);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/client/${token}/review`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Mock directions for the active project
  const mockDirections = [
    {
      id: "dir-1",
      name: "Direction A · Monolithic Obsidian",
      description: "Severe architectural typography with deep charcoal fields and luminous ultraviolet beacons.",
      palette: [selectedProject?.visualPreview?.palette?.[0] || "#8B5CF6", "#08090E", "#38BDF8", "#F8FAFC"],
      fonts: { heading: "Satoshi Display", body: "Plus Jakarta Sans" },
      status: "Approved",
      feedbackCount: 3,
    },
    {
      id: "dir-2",
      name: "Direction B · Chromatic Horizon",
      description: "Warm radiant gradients, organic fluid curvature, and high-contrast editorial serifs.",
      palette: ["#EC4899", "#8B5CF6", "#F59E0B", "#1E1B4B"],
      fonts: { heading: "Editorial New", body: "Inter Sans" },
      status: "Pending Review",
      feedbackCount: 1,
    },
  ];

  // Feedback comments for active project
  const [localFeedback, setLocalFeedback] = useState([
    {
      id: "fb-1",
      author: "Sarah Chen (Client Lead)",
      role: "Client",
      direction: "Direction A · Monolithic Obsidian",
      comment: "The typography hierarchy on the hero section is stunning. We love the high-contrast contrast ratio and subtle purple glow.",
      timestamp: "Today at 2:15 PM",
      resolved: false,
    },
    {
      id: "fb-2",
      author: "Alex Rivera (Studio Lead)",
      role: "Designer",
      direction: "Direction A · Monolithic Obsidian",
      comment: "Adjusted the body copy leading by +2px for enhanced editorial readability on 4K displays.",
      timestamp: "Today at 3:40 PM",
      resolved: true,
    },
    {
      id: "fb-3",
      author: "Sarah Chen (Client Lead)",
      role: "Client",
      direction: "Direction B · Chromatic Horizon",
      comment: "Direction B feels a bit too playful for our enterprise demographic. We definitely prefer Direction A.",
      timestamp: "Yesterday at 6:10 PM",
      resolved: true,
    },
  ]);

  const handleAddDesignerReply = () => {
    if (!newCommentText.trim()) return;
    const newEntry = {
      id: `fb-${Date.now()}`,
      author: "Bhuvana (Lead Designer)",
      role: "Designer",
      direction: mockDirections.find((d) => d.id === selectedDirection)?.name || "Direction A",
      comment: newCommentText.trim(),
      timestamp: "Just now",
      resolved: false,
    };
    setLocalFeedback([newEntry, ...localFeedback]);
    setNewCommentText("");
  };

  const activeShare = activeProjectShares[0];
  const primaryToken = activeShare?.token || "aura-client-portal";

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#08090E] text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <ProjectSelectorHeader
          badge="FEATURE 10 · CLIENT DIRECTION APPROVAL"
          badgeIcon={<ShieldCheck size={13} className="text-[#8B5CF6]" />}
          title="Client Approval Hub"
          description="Dedicated client presentation and approval portal. Manage granular review links, gather real-time client feedback, trace revisions, and capture digital signatures."
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateShare}
                disabled={isGeneratingLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
              >
                <Plus size={13} />
                <span>Create New Review Link</span>
              </button>
            </div>
          }
        />

        {linkSuccessMsg && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{linkSuccessMsg}</span>
          </div>
        )}

        {/* Status KPI Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-ink-secondary dark:text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Approval Status</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xl font-extrabold text-ink mt-2">Approved</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-1">
              Direction A signed off by client
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-ink-secondary dark:text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Client Feedback</span>
              <MessageSquare size={14} className="text-[#8B5CF6]" />
            </div>
            <p className="text-xl font-extrabold text-ink mt-2">{localFeedback.length} Comments</p>
            <p className="text-[11px] text-ink-tertiary font-mono mt-1">
              2 resolved · 1 pending follow-up
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-ink-secondary dark:text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Active Links</span>
              <Lock size={14} className="text-[#38BDF8]" />
            </div>
            <p className="text-xl font-extrabold text-ink mt-2">
              {activeProjectShares.length || 1} Controlled
            </p>
            <p className="text-[11px] text-ink-tertiary font-mono mt-1">
              Token-gated access with permissions
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-5 shadow-2xs">
            <div className="flex items-center justify-between text-ink-secondary dark:text-slate-400">
              <span className="text-[11px] font-mono uppercase tracking-wider">Revision Round</span>
              <History size={14} className="text-[#EC4899]" />
            </div>
            <p className="text-xl font-extrabold text-ink mt-2">Round 02</p>
            <p className="text-[11px] text-ink-tertiary font-mono mt-1">
              Final polish stage complete
            </p>
          </div>
        </div>

        {/* Share Link Management Console */}
        <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#8B5CF6]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                  Secure Client Review Link
                </h2>
              </div>
              <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1">
                Clients can view directions, compare concepts, inspect palettes & typography, and leave element comments without editing permissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/client/${primaryToken}/review`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 text-xs font-semibold text-[#8B5CF6] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Eye size={13} />
                <span>Preview Client View</span>
                <ExternalLink size={11} />
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] font-mono text-xs text-ink truncate">
              {typeof window !== "undefined"
                ? `${window.location.origin}/client/${primaryToken}/review`
                : `/client/${primaryToken}/review`}
            </div>
            <button
              onClick={() => handleCopyLink(primaryToken)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-paper text-xs font-semibold hover:opacity-90 transition-all shrink-0"
            >
              {copiedToken === primaryToken ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Client Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Column Workspace: Directions under Review vs Feedback Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Creative Directions Under Review (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Layers size={15} className="text-[#8B5CF6]" />
                <span>Active Directions ({mockDirections.length})</span>
              </h2>
              <span className="text-[11px] font-mono text-ink-tertiary">
                Read-only client presentation
              </span>
            </div>

            <div className="space-y-4">
              {mockDirections.map((dir) => (
                <div
                  key={dir.id}
                  className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm space-y-4 hover:border-[#8B5CF6]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-ink">{dir.name}</h3>
                        {dir.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                            <CheckCircle2 size={11} />
                            <span>Client Approved</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-semibold">
                            <Clock size={11} />
                            <span>In Review</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-secondary dark:text-slate-400 mt-1">
                        {dir.description}
                      </p>
                    </div>

                    <Link
                      href={`/client/${primaryToken}/review/${dir.id}`}
                      target="_blank"
                      className="h-8 w-8 rounded-xl border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center text-ink-tertiary hover:text-ink hover:border-[#8B5CF6]/50 transition-colors shrink-0"
                      title="Inspect full direction presentation"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Palette Swatches */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary block mb-1.5">
                      Harmonized Palette
                    </span>
                    <div className="flex items-center gap-2">
                      {dir.palette.map((hex, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span
                            className="h-6 w-8 rounded-lg border border-black/10 dark:border-white/10 shadow-2xs"
                            style={{ backgroundColor: hex }}
                          />
                          <span className="text-[10px] font-mono text-ink-tertiary">{hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography Pairing */}
                  <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-ink-tertiary block">
                        Display Font
                      </span>
                      <span className="font-bold text-ink">{dir.fonts.heading}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-ink-tertiary block">
                        Body Font
                      </span>
                      <span className="font-medium text-ink">{dir.fonts.body}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-ink-tertiary block">
                        Comments
                      </span>
                      <span className="font-mono text-xs text-[#8B5CF6]">
                        {dir.feedbackCount} feedback notes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formal Digital Signature Card */}
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Recorded Client Sign-off
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80">
                  VERIFIED SIGNATURE
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-tertiary block">
                    Signee
                  </span>
                  <p className="font-semibold text-ink mt-0.5">
                    Sarah Chen · Lead Brand Director
                  </p>
                  <p className="text-[11px] text-ink-tertiary font-mono">
                    sarah.chen@kineticmedia.io
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-tertiary block">
                    Approved Direction
                  </span>
                  <p className="font-semibold text-ink mt-0.5">
                    Direction A · Monolithic Obsidian
                  </p>
                  <p className="text-[11px] text-ink-tertiary font-mono">
                    Approved on 2026-11-25 14:32 UTC
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Feedback Stream & Reply Console (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0D0E15] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-[#8B5CF6]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                    Client Feedback Stream
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-[#8B5CF6]">
                  Live Sync
                </span>
              </div>

              {/* Comment Thread */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {localFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-[#11131E] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            fb.role === "Client" ? "bg-[#38BDF8]" : "bg-[#8B5CF6]"
                          }`}
                        />
                        <span className="font-bold text-ink">{fb.author}</span>
                      </div>
                      <span className="text-[10px] font-mono text-ink-tertiary">
                        {fb.timestamp}
                      </span>
                    </div>

                    <p className="text-ink-secondary dark:text-slate-300 text-xs leading-relaxed">
                      "{fb.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-ink-tertiary">
                      <span className="truncate max-w-[180px]">{fb.direction}</span>
                      {fb.resolved ? (
                        <span className="text-emerald-400">Resolved</span>
                      ) : (
                        <span className="text-amber-400">Pending Review</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Box */}
              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono uppercase text-ink-secondary">
                    Reply as Designer
                  </span>
                  <select
                    value={selectedDirection}
                    onChange={(e) => setSelectedDirection(e.target.value)}
                    className="text-[11px] bg-transparent font-mono text-ink border border-black/[0.08] dark:border-white/[0.1] rounded-lg px-2 py-1"
                  >
                    {mockDirections.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.slice(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Type response, clarification, or revision note..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#131520] text-xs text-ink focus:outline-none focus:border-[#8B5CF6] resize-none"
                  />
                  <button
                    onClick={handleAddDesignerReply}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-ink text-paper text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    <Send size={12} />
                    <span>Post Designer Reply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit / Client Activity Log */}
            <div className="rounded-3xl border border-black/[0.06] dark:border-white/[0.06] bg-stone-50/50 dark:bg-[#0B0C12] p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-ink">
                <History size={14} className="text-[#8B5CF6]" />
                <span>Client Activity Audit</span>
              </div>
              <div className="space-y-2 text-[11px] text-ink-secondary dark:text-slate-400 font-mono">
                <div className="flex items-center justify-between">
                  <span>• Link accessed via token</span>
                  <span>14:10 UTC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Inspected Direction A palette</span>
                  <span>14:18 UTC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Tested Light/Dark appearance</span>
                  <span>14:24 UTC</span>
                </div>
                <div className="flex items-center justify-between text-emerald-400">
                  <span>• Signed Direction A Approval</span>
                  <span>14:32 UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

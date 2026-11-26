"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Lightbulb,
  Mic,
  ChevronDown,
  MoreHorizontal,
  Diamond,
  Settings,
  HelpCircle,
  ExternalLink,
  Bot,
  User,
  Trash2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { queryBoard } from "@/lib/intelligence/ai-engine";
import type { BoardChatMessage } from "@/lib/intelligence/types";
import { safeStorage } from "@/lib/safe-storage";

export default function AskBoardPage() {
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId") || searchParams.get("project");

  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<BrandProject | null>(() => {
    if (requestedProjectId) {
      const found = projects.find((p) => p.id === requestedProjectId);
      if (found) return found;
    }
    return projects.length > 0 ? projects[0] : null;
  });

  const [messages, setMessages] = useState<BoardChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Nebula 4.0e");
  const [activeRecentChat, setActiveRecentChat] = useState("Brand Coherence Audit");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recentChats = [
    "Audit Brand Colors",
    "Extract Visual DNA: Aura",
    "Compare Direction A vs B",
    "Positioning White Space",
    "Font Hierarchy Study",
  ];

  // Load chat history from storage when project changes
  useEffect(() => {
    if (selectedProject) {
      const stored = safeStorage.get<BoardChatMessage[]>(
        `agix_chat_${selectedProject.id}`,
        []
      );
      if (stored.length > 0) {
        setMessages(stored);
      } else {
        setMessages([]);
      }
    }
  }, [selectedProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || !selectedProject || isTyping) return;

    const userMsg: BoardChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await queryBoard(
        selectedProject,
        textToSend,
        messages.slice(-6)
      );
      const finalMessages = [...updated, aiResponse];
      setMessages(finalMessages);
      safeStorage.set(`agix_chat_${selectedProject.id}`, finalMessages);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: BoardChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered an error querying your board. Please verify your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      };
      setMessages([...updated, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (selectedProject) {
      safeStorage.remove(`agix_chat_${selectedProject.id}`);
      setMessages([]);
    }
  };

  return (
    <div className="relative space-y-6 max-w-7xl mx-auto">
      {/* Ambient background caustics matching Image 2 */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Page Header (Standard AGIX Pattern) ───────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            <Sparkles size={12} />
            <span>AI Assist · Nebula Cognitive Co-Pilot</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
            Ask Your Board
          </h1>
          <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
            Context-aware AI partner querying your project's visual DNA, colors, typography, and reference library.
          </p>
        </div>

        {selectedProject && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs font-mono text-ink">
            <span className="text-ink-tertiary">Active Project:</span>
            <span className="font-bold text-[#8B5CF6]">{selectedProject.name}</span>
          </div>
        )}
      </header>

      {/* ── Main Two-Pane Body (Merged with Web UI) ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drawer (w-full lg:col-span-4 xl:col-span-3) */}
        <aside className="lg:col-span-4 xl:col-span-3 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-5 flex flex-col justify-between gap-6 shrink-0">
          <div className="space-y-5">
            {/* Logo / Torus icon */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#A855F7] to-[#EC4899] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="font-extrabold tracking-wider text-xs text-ink uppercase block">
                  Nebula Co-Pilot
                </span>
                <span className="text-[10px] font-mono text-ink-tertiary">Brand Intelligence</span>
              </div>
            </div>

            {/* New Chat Button */}
            <button
              onClick={handleClearHistory}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] text-white font-medium text-xs shadow-sm hover:shadow-[0_6px_20px_rgba(139,92,246,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={13} className="text-purple-300 dark:text-white" />
              <span>New Conversation</span>
            </button>

            {/* Recent Chats Section */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary px-1 block">
                Suggested Prompts
              </span>
              <div className="space-y-1">
                {recentChats.map((title) => (
                  <button
                    key={title}
                    onClick={() => {
                      setActiveRecentChat(title);
                      handleSend(title);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs truncate transition-colors ${
                      activeRecentChat === title
                        ? "bg-stone-100 dark:bg-white/[0.08] text-ink font-semibold"
                        : "text-ink-secondary hover:text-ink hover:bg-stone-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector Card */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary block">
                Model Engine
              </span>
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>{selectedModel}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Multimodal
                </span>
              </div>
              <p className="text-[10px] text-ink-tertiary leading-relaxed">
                Grounds responses using project references, color palettes, and visual DNA tokens.
              </p>
            </div>
          </div>

          {/* Bottom Area: Project Context Status */}
          <div className="pt-4 border-t border-border-subtle space-y-2 text-xs">
            <div className="flex items-center justify-between text-ink-secondary">
              <span className="text-[11px] font-mono">Project Context</span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-border-subtle text-[11px] text-ink-secondary font-mono truncate">
              {selectedProject?.name || "Global Workspace"}
            </div>
          </div>
        </aside>

        {/* Right Main Chat Canvas (lg:col-span-8 xl:col-span-9) */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-[24px] border border-border-subtle bg-surface shadow-subtle p-6 flex flex-col justify-between min-h-[640px] relative overflow-hidden">
          {/* Subtle cosmic background glow */}
          <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-[#8B5CF6]/10 via-[#A855F7]/5 to-transparent blur-3xl opacity-70" />

          {/* Top Bar with Model Switcher & Status */}
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle shrink-0 z-10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-ink">{selectedModel}</span>
              <span className="text-[11px] text-ink-tertiary font-mono">· Visual & Strategic Analysis</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                title="Clear chat"
                className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-stone-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Center Chat View: Hero or Message Stream */}
          <div className="flex-1 overflow-y-auto py-6 custom-scrollbar z-10">
            {messages.length === 0 ? (
              /* Welcome Hero with Cosmic Sphere (matching Image 3) */
              <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto pt-6 space-y-6">
                {/* 3D Glowing Cosmic Nebula Sphere */}
                <div className="relative h-20 w-20 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#38BDF8] blur-md opacity-80 animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#1E1235] via-[#2E1850] to-[#0A071E] border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
                    <Sparkles size={24} className="text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                    Welcome to your cognitive co-pilot
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-secondary dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    I am Nebula. You can ask me to analyze project references, audit color harmony, suggest fonts, or test creative directions.
                  </p>
                </div>

                {/* 3 Suggestion Cards in a Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4">
                  {[
                    {
                      icon: "</>",
                      title: "Audit Colors",
                      desc: "Find dominant colors in my references and check contrast.",
                    },
                    {
                      icon: "✦",
                      title: "Compare Directions",
                      desc: "Compare Direction A with Direction B for audience fit.",
                    },
                    {
                      icon: "💡",
                      title: "Brainstorm Ideas",
                      desc: "Suggest 3 luxury minimalist alternative directions.",
                    },
                  ].map((card, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(card.desc)}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-white/[0.04] hover:bg-stone-100 dark:hover:bg-white/[0.08] border border-border-subtle text-left transition-all hover:scale-[1.02] shadow-2xs flex flex-col justify-between h-32 group"
                    >
                      <span className="font-mono text-xs text-[#8B5CF6] font-bold">
                        {card.icon} {card.title}
                      </span>
                      <p className="text-[11px] text-ink-secondary leading-snug line-clamp-3 group-hover:text-ink">
                        "{card.desc}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Message Stream */
              <div className="space-y-4 max-w-2xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                        msg.sender === "user"
                          ? "bg-ink text-paper font-bold"
                          : "bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] text-white shadow-md shadow-purple-500/30"
                      }`}
                    >
                      {msg.sender === "user" ? <User size={13} /> : <Sparkles size={13} />}
                    </div>

                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[85%] ${
                        msg.sender === "user"
                          ? "bg-ink text-paper font-medium shadow-xs"
                          : "bg-stone-50 dark:bg-white/[0.05] border border-border-subtle text-ink shadow-2xs"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="text-[9px] font-mono opacity-50 block mt-2">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-ink-tertiary pl-10 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] animate-ping" />
                    <span>Nebula reasoning with project board...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Floating Pill Input Bar (matching Image 3) */}
          <div className="pt-4 z-10 max-w-2xl w-full mx-auto">
            <div className="rounded-2xl bg-stone-50 dark:bg-white/[0.04] border border-border-subtle p-3 shadow-subtle backdrop-blur-xl space-y-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask anything about your brand project..."
                className="w-full bg-transparent px-2 text-xs text-ink placeholder:text-ink-tertiary focus:outline-none"
              />

              <div className="flex items-center justify-between pt-1">
                {/* Left Action Pills */}
                <div className="flex items-center gap-1.5 text-[11px] text-ink-secondary">
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors">
                    <Paperclip size={11} />
                    <span>Files</span>
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors">
                    <ImageIcon size={11} />
                    <span>Images</span>
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-200/60 dark:hover:bg-white/10 transition-colors">
                    <Lightbulb size={11} />
                    <span>Reasoning</span>
                  </button>
                </div>

                {/* Right Send & Voice */}
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink transition-colors">
                    <Mic size={14} />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="h-7 w-7 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-md shadow-purple-500/30 disabled:opacity-40"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

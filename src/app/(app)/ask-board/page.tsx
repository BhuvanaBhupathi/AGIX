"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquareQuote,
  Send,
  Sparkles,
  Bot,
  User,
  Layers,
  ArrowRight,
  ExternalLink,
  Trash2,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import { BrandProject } from "@/lib/data";
import { queryBoard } from "@/lib/intelligence/ai-engine";
import type { BoardChatMessage } from "@/lib/intelligence/types";
import { ProjectSelectorHeader } from "@/components/intelligence/ProjectSelectorHeader";
import { safeStorage } from "@/lib/safe-storage";

const SUGGESTED_QUERIES = [
  "What colors appear most frequently in my references?",
  "Which fonts match this brand personality?",
  "What visual direction connects these references?",
  "Find inconsistencies in my current direction.",
  "Suggest three alternative branding directions.",
  "Explain why this reference works.",
  "Compare my saved inspiration images.",
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        // Initial welcome message grounded in project
        setMessages([
          {
            id: `welcome-${Date.now()}`,
            sender: "assistant",
            text: `Welcome to **Ask Your Board** for **${selectedProject.name}**.\n\nI am connected to your **${selectedProject.canvasObjects?.length || 0} canvas assets**, **Brand Brain**, and active color palettes. Ask me anything about color harmony, typography alignment, direction consistency, or request creative alternatives.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            suggestedFollowUps: [
              "What colors appear most frequently in my references?",
              "Which fonts match this brand personality?",
              "Find inconsistencies in my current direction.",
            ],
          },
        ]);
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
      const assistantMsg = await queryBoard(selectedProject, updated, textToSend);
      const withAssistant = [...updated, assistantMsg];
      setMessages(withAssistant);
      safeStorage.set(`agix_chat_${selectedProject.id}`, withAssistant);
    } catch {
      const errorMsg: BoardChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered a momentary issue querying the board assets. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      };
      setMessages([...updated, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (!selectedProject) return;
    safeStorage.set(`agix_chat_${selectedProject.id}`, []);
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        sender: "assistant",
        text: `Conversation cleared. I am ready to analyze **${selectedProject.name}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="relative space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <ProjectSelectorHeader
        badge="Board Intelligence"
        badgeIcon={<MessageSquareQuote size={13} className="text-[#8B5CF6]" />}
        title="Ask Your Board"
        description="Conversational AI assistant directly connected to this project's canvas objects, visual references, fonts, and Brand Brain."
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => setSelectedProject(p)}
        actions={
          <button
            type="button"
            onClick={clearHistory}
            title="Clear Chat History"
            className="p-2 rounded-full border border-black/[0.08] dark:border-white/[0.08] hover:bg-stone-100 dark:hover:bg-white/[0.06] text-ink-tertiary hover:text-ink transition-colors"
          >
            <Trash2 size={14} />
          </button>
        }
      />

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "assistant" && (
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Bot size={15} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-[22px] p-4 sm:p-5 space-y-3 ${
                msg.sender === "user"
                  ? "bg-[#191918] dark:bg-[#8B5CF6] text-white shadow-sm"
                  : "bg-white dark:bg-[#0E1018]/90 border border-black/[0.06] dark:border-white/[0.08] text-ink shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-70">
                <span>{msg.sender === "user" ? "You" : "Board Assistant"}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message text with basic Markdown formatting */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2">
                {msg.text}
              </div>

              {/* Referenced Assets Badges */}
              {msg.referencedAssets && msg.referencedAssets.length > 0 && (
                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-tertiary dark:text-slate-400">
                    Grounded in Project Assets:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {msg.referencedAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/[0.06] text-[11px] font-medium text-ink border border-black/[0.04] dark:border-white/[0.08]"
                      >
                        {asset.color && (
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: asset.color }}
                          />
                        )}
                        <span>{asset.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contextual Suggested Follow-ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                  {msg.suggestedFollowUps.map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="text-[11px] px-3 py-1 rounded-full bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-500/30 text-[#6D28D9] dark:text-[#C4B5FD] hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="h-8 w-8 rounded-xl bg-stone-200 dark:bg-white/10 text-ink flex items-center justify-center shrink-0 shadow-sm mt-1">
                <User size={15} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={15} />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E1018]/90 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-ink-tertiary ml-1 font-mono">Analyzing board assets…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono text-ink-tertiary shrink-0 uppercase">Suggested:</span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-stone-100/90 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs text-ink-secondary dark:text-slate-300 hover:text-ink dark:hover:text-white hover:border-[#8B5CF6]/50 whitespace-nowrap transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2 p-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#0E1018] shadow-sm focus-within:border-[#8B5CF6] focus-within:ring-2 focus-within:ring-[#8B5CF6]/20 transition-all"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this project's colors, typography, references, or directions…"
          className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-tertiary dark:placeholder:text-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="h-9 w-9 rounded-full bg-[#191918] dark:bg-[#8B5CF6] text-white flex items-center justify-center hover:bg-[#333] dark:hover:bg-[#7C3AED] transition-colors disabled:opacity-40 cursor-pointer shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

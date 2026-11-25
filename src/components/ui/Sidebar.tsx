"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Compass,
  FolderOpen,
  Users,
  Brain,
  Dna,
  Bot,
  Sparkles,
  ShieldCheck,
  GitCompare,
  Sliders,
  History,
  Globe,
  CheckCircle2,
  Settings,
  LogOut,
} from "lucide-react";
import { NavigationItem } from "./NavigationItem";
import { Avatar } from "./Avatar";
import { useAuth } from "@/lib/auth-context";
import { useProjects } from "@/lib/projects-context";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { projects } = useProjects();

  const primaryItems = [
    { href: "/home", label: "Home", icon: Home },
    {
      href: "/projects",
      label: "Projects",
      icon: Layers,
      badge: projects.length > 0 ? projects.length : undefined,
    },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/library", label: "Library", icon: FolderOpen },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/brand-brain", label: "Brand Brain", icon: Brain },
  ];

  const intelligenceItems = [
    { href: "/visual-dna", label: "Visual DNA", icon: Dna },
    { href: "/ask-board", label: "Ask Your Board", icon: Bot },
    { href: "/reference-intelligence", label: "Reference Intelligence", icon: Sparkles },
    { href: "/brand-coherence", label: "Brand Coherence", icon: ShieldCheck },
  ];

  const decisionsItems = [
    { href: "/direction-clash", label: "Direction Clash", icon: GitCompare },
    { href: "/creative-alternatives", label: "Creative Alternatives", icon: Sliders },
    { href: "/evolution-timeline", label: "Evolution Timeline", icon: History },
  ];

  const deliveryItems = [
    { href: "/brand-in-the-wild", label: "Brand in the Wild", icon: Globe },
    { href: "/client-approval", label: "Client Approval", icon: CheckCircle2 },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-border-subtle bg-paper px-3 py-3 select-none transition-colors duration-200">
      {/* Workspace Header / Wordmark */}
      <div className="px-2 pt-1 pb-3 shrink-0">
        <Link
          href="/home"
          className="flex items-center gap-2.5 group rounded-2xl p-1.5 -ml-1 transition-all duration-200 hover:bg-stone-100/70 dark:hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-1"
        >
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-[#A855F7] via-[#8B5CF6] to-[#4C1D95] flex items-center justify-center text-[11px] font-black text-white tracking-wider shadow-[0_2px_10px_rgba(139,92,246,0.35)] ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(168,85,247,0.45)] transition-all duration-200">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-white fill-none stroke-current stroke-[2.8]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19L12 5L20 19" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-[0.14em] uppercase text-ink group-hover:text-black dark:group-hover:text-white transition-colors">
                AGIX
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-ink-tertiary uppercase tracking-widest">
              BRAND STUDIO
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links with Scroll Container */}
      <nav className="flex-1 overflow-y-auto pr-1 space-y-4 py-1 custom-scrollbar">
        {/* Core Workspace Items */}
        <div className="space-y-0.5">
          {primaryItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={
                pathname === item.href || (item.href === "/home" && pathname === "/")
              }
            />
          ))}
        </div>

        {/* Intelligence Systems */}
        <div className="space-y-0.5 pt-1">
          <p className="px-3 pb-1 text-[9px] font-mono tracking-widest text-ink-tertiary uppercase font-semibold">
            INTELLIGENCE
          </p>
          {intelligenceItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Creative Decisions */}
        <div className="space-y-0.5 pt-1">
          <p className="px-3 pb-1 text-[9px] font-mono tracking-widest text-ink-tertiary uppercase font-semibold">
            CREATIVE DECISIONS
          </p>
          {decisionsItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Delivery */}
        <div className="space-y-0.5 pt-1">
          <p className="px-3 pb-1 text-[9px] font-mono tracking-widest text-ink-tertiary uppercase font-semibold">
            DELIVERY
          </p>
          {deliveryItems.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Area: Settings & User Profile */}
      <div className="pt-2 shrink-0 space-y-2 border-t border-border-subtle">
        <NavigationItem
          href="/settings"
          label="Settings"
          icon={Settings}
          isActive={pathname === "/settings"}
        />

        {/* User Account / Workspace Footer */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-stone-100/50 dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.08] hover:bg-stone-100/80 dark:hover:bg-white/[0.06] transition-colors duration-150 group">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar initials={user.initials} size="sm" name={user.fullName} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink">
                {user.fullName}
              </p>
              <p className="truncate text-[10px] text-ink-tertiary">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="w-7 h-7 rounded-full flex items-center justify-center text-ink-tertiary hover:text-ink hover:bg-white dark:hover:bg-white/10 transition-colors duration-150 shadow-none hover:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
          >
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  );
}

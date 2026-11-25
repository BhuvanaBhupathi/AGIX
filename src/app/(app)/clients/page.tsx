"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Search, X, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useProjects } from "@/lib/projects-context";
import { ClientList } from "@/components/clients/ClientList";
import { AddClientModal } from "@/components/clients/AddClientModal";

type View = "overview" | "leads" | "active" | "all" | "followups";

const VIEWS: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "leads", label: "Leads" },
  { id: "active", label: "Active Clients" },
  { id: "all", label: "All Clients" },
  { id: "followups", label: "Follow-ups" },
];

export default function ClientsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-ink-tertiary">Loading clients…</div>}>
      <ClientsContent />
    </React.Suspense>
  );
}

function ClientsContent() {
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") as View) || "overview";

  const { clients, projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const leads = clients.filter((c) => c.status === "Lead");
  const active = clients.filter((c) => c.status === "Active");
  const counts: Record<View, number> = {
    overview: clients.length,
    leads: leads.length,
    active: active.length,
    all: clients.length,
    followups: 0,
  };

  const recent = [...clients]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 4);

  const q = searchQuery.trim().toLowerCase();
  const searchedAll = q
    ? clients.filter((c) =>
        [c.name, c.company || "", c.email || "", c.status].join(" ").toLowerCase().includes(q)
      )
    : clients;

  const stats = [
    { label: "Total clients", value: clients.length },
    { label: "Leads", value: leads.length },
    { label: "Active", value: active.length },
    { label: "Linked projects", value: projects.length },
  ];

  return (
    <div className="relative space-y-6 max-w-6xl">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* Header */}
      <header className="pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
              <span>Client Directory & Partnerships</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
              Clients <span className="text-ink-tertiary dark:text-slate-400 font-normal text-2xl font-mono">({clients.length})</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink-secondary dark:text-slate-400">
              Your partnerships, contacts, and the brand work behind them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] dark:from-[#8B5CF6] dark:via-[#6366F1] dark:to-[#38BDF8] hover:from-[#2E1A47] hover:to-[#1E1130] text-white text-xs sm:text-sm font-medium transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] dark:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:-translate-y-[1px] active:translate-y-0 border border-purple-500/25 ring-1 ring-white/10 shrink-0"
          >
            <Plus size={15} className="text-purple-300 dark:text-white transition-transform duration-300 group-hover:rotate-90 shrink-0" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Sub-navigation */}
        <nav className="mt-5 flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs w-fit max-w-full overflow-x-auto backdrop-blur-xs">
          {VIEWS.map((v) => (
            <Link
              key={v.id}
              href={`/clients?view=${v.id}`}
              className={`px-4 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 text-xs ${
                view === v.id
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span>{v.label}</span>
              <span className="font-mono text-[10px] text-ink-tertiary dark:text-slate-400">({counts[v.id]})</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Overview */}
      {view === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#0E1018]/90 p-5 shadow-sm hover:border-[#8B5CF6]/40 hover:shadow-[0_12px_28px_rgba(139,92,246,0.12)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink group-hover:text-[#6D28D9] dark:group-hover:text-[#C4B5FD] transition-colors">{s.value}</p>
                <p className="text-[11px] font-mono text-ink-tertiary dark:text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <section>
            <SectionHeader
              title="Recent clients"
              description="Recently updated records"
              actionHref="/clients?view=all"
              actionLabel="View all"
            />
            <ClientList
              clients={recent}
              projects={projects}
              emptyTitle="No clients yet"
              emptyBody="Add a client to begin tracking partnerships and brand workspaces."
            />
          </section>
        </div>
      )}

      {/* Leads */}
      {view === "leads" && (
        <ClientList
          clients={leads}
          projects={projects}
          emptyTitle="No lead records"
          emptyBody="Prospects and prospective clients will show up here."
        />
      )}

      {/* Active Clients */}
      {view === "active" && (
        <ClientList
          clients={active}
          projects={projects}
          emptyTitle="No active clients"
          emptyBody="Clients with live brand identity projects will appear here."
        />
      )}

      {/* All Clients */}
      {view === "all" && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter clients by name, company, or email..."
              className="w-full h-9 pl-9 pr-8 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#121422] text-xs text-ink dark:text-white placeholder:text-ink-tertiary dark:placeholder:text-slate-500 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink dark:hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <ClientList
            clients={searchedAll}
            projects={projects}
            emptyTitle="No matching clients"
            emptyBody="Try adjusting your search criteria."
          />
        </div>
      )}

      {/* Follow-ups */}
      {view === "followups" && (
        <div className="rounded-[24px] border border-dashed border-border-subtle bg-white/60 dark:bg-[#0E1018]/50 p-12 text-center">
          <div className="mx-auto h-11 w-11 rounded-2xl bg-stone-100 dark:bg-white/[0.06] flex items-center justify-center text-ink-tertiary dark:text-slate-400 mb-3 shadow-2xs">
            <CalendarClock size={18} />
          </div>
          <h3 className="text-sm font-semibold text-ink">All follow-ups caught up</h3>
          <p className="mt-1 text-xs text-ink-secondary dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            No pending touchpoints. Set next contact dates in client detail pages to track outreach.
          </p>
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}

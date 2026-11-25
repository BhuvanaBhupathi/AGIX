"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
  Heart,
  Plus,
  Compass,
  Type,
  Droplets,
  BookOpen,
  Bookmark,
  Check,
  ExternalLink,
  Palette,
  Loader2,
  Globe,
} from "lucide-react";
import { useProjects } from "@/lib/projects-context";
import {
  NormalizedInspirationItem,
  InspirationCategory,
} from "@/lib/inspiration/types";
import {
  defaultInspirationProvider,
  MOCK_INSPIRATION_ITEMS,
  SUGGESTED_TOPICS,
} from "@/lib/inspiration/mock-provider";
import { pixabayInspirationProvider } from "@/lib/inspiration/pixabay-provider";
import { isPixabayConfigured } from "@/lib/pixabay-config";
import { InspirationCard } from "@/components/explore/InspirationCard";
import { InspirationDetailModal } from "@/components/explore/InspirationDetailModal";
import { AddToProjectModal } from "@/components/explore/AddToProjectModal";
import { TypographyExplore } from "@/components/explore/TypographyExplore";
import { ColorExplore } from "@/components/explore/ColorExplore";
import { SavedExplore } from "@/components/explore/SavedExplore";
import { ImagePalette } from "@/components/explore/ImagePalette";

export type ExploreTab =
  | "discover"
  | "typography"
  | "colors"
  | "image-palette"
  | "references"
  | "saved";

export default function ExplorePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-ink-tertiary">Loading inspiration feed...</div>}>
      <ExploreContent />
    </React.Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ExploreTab) || "discover";
  const initialProjectId = searchParams.get("projectId") || searchParams.get("project") || null;

  const { projects, library, saveToLibrary, removeFromLibrary, addInspirationToCanvas } =
    useProjects();

  const [activeTab, setActiveTab] = useState<ExploreTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState<string>("All");
  const [activeMood, setActiveMood] = useState<string>("All");

  // All inspiration items from the curated provider
  const [allItems, setAllItems] = useState<NormalizedInspirationItem[]>(MOCK_INSPIRATION_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  // Pixabay Live Search Integration
  const [pixabayItems, setPixabayItems] = useState<NormalizedInspirationItem[]>([]);
  const [isPixabayLoading, setIsPixabayLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<"all" | "curated" | "pixabay">("all");
  const hasPixabay = isPixabayConfigured();

  // Detail Modal & Add to Project Modal states
  const [detailItem, setDetailItem] = useState<NormalizedInspirationItem | null>(null);
  const [modalItem, setModalItem] = useState<NormalizedInspirationItem | null>(null);
  const [defaultPlaceOnCanvas, setDefaultPlaceOnCanvas] = useState(false);

  // Quick feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load items from curated provider
  useEffect(() => {
    let isMounted = true;
    defaultInspirationProvider
      .getTrending()
      .then((items) => {
        if (isMounted) {
          setAllItems(items);
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch live Pixabay items when searching or topic changes
  useEffect(() => {
    if (!hasPixabay || sourceFilter === "curated") {
      return;
    }

    let isMounted = true;
    setIsPixabayLoading(true);

    const timer = setTimeout(() => {
      pixabayInspirationProvider
        .search(searchQuery, { category: activeTopic })
        .then((items) => {
          if (isMounted) {
            setPixabayItems(items);
            setIsPixabayLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsPixabayLoading(false);
        });
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, activeTopic, sourceFilter, hasPixabay]);

  // Track saved item IDs from unified library
  const savedItemIds = useMemo(() => {
    return new Set(
      library.map((l) => l.content?.pinId || l.id || l.name)
    );
  }, [library]);

  const isItemSaved = (item: NormalizedInspirationItem) => {
    return (
      savedItemIds.has(item.id) ||
      library.some((l) => l.name === item.title || l.content?.title === item.title)
    );
  };

  // Active contextual project (if project-aware)
  const contextualProject = projects.find((p) => p.id === initialProjectId) || null;

  // Filter items for Discover & References combining Curated + Pixabay
  const filteredFeedItems = useMemo(() => {
    // 1. Filter Curated Items
    const curatedFiltered = allItems.filter((item) => {
      if (activeTab === "references" && item.type !== "reference") return false;
      if (activeTopic !== "All" && item.category !== activeTopic) return false;
      if (activeMood !== "All" && item.metadata?.mood !== activeMood) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [
          item.title,
          item.creator ?? "",
          item.category,
          ...item.tags,
          item.metadata?.mood ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // 2. Filter Pixabay Items
    const pixabayFiltered = pixabayItems.filter((item) => {
      if (activeTopic !== "All" && item.category !== activeTopic) return false;
      return true;
    });

    if (sourceFilter === "curated") {
      return curatedFiltered;
    }
    if (sourceFilter === "pixabay") {
      return pixabayFiltered;
    }

    // "all": Interleave curated and live Pixabay results
    const combined: NormalizedInspirationItem[] = [];
    const seenIds = new Set<string>();

    const maxLen = Math.max(curatedFiltered.length, pixabayFiltered.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < curatedFiltered.length && !seenIds.has(curatedFiltered[i].id)) {
        combined.push(curatedFiltered[i]);
        seenIds.add(curatedFiltered[i].id);
      }
      if (i < pixabayFiltered.length && !seenIds.has(pixabayFiltered[i].id)) {
        combined.push(pixabayFiltered[i]);
        seenIds.add(pixabayFiltered[i].id);
      }
    }

    return combined;
  }, [allItems, pixabayItems, activeTab, activeTopic, activeMood, searchQuery, sourceFilter]);

  // Save handler
  const handleSave = (item: NormalizedInspirationItem, note?: string) => {
    saveToLibrary({
      type: item.type,
      name: item.title,
      notes: note,
      source: item.creator || item.provider,
      sourceUrl: item.sourceUrl,
      imageUrl: item.imageUrl,
      tags: item.tags,
      content: {
        pinId: item.id,
        title: item.title,
        source: item.creator || item.provider,
        url: item.imageUrl,
        sourceUrl: item.sourceUrl,
        tags: item.tags,
        note,
        metadata: item.metadata,
      },
    });
    triggerToast(`Saved "${item.title}" to Library`);
  };

  // Add to Project handler
  const handleOpenAddToProject = (item: NormalizedInspirationItem) => {
    setModalItem(item);
    setDefaultPlaceOnCanvas(false);
  };

  // Add directly to Canvas handler
  const handleOpenAddToCanvas = (item: NormalizedInspirationItem) => {
    // If only one project exists or contextual project is active, add immediately or prompt
    if (contextualProject) {
      addInspirationToCanvas(contextualProject.id, item);
      triggerToast(`Placed on ${contextualProject.name}'s Canvas`);
      return;
    }

    setModalItem(item);
    setDefaultPlaceOnCanvas(true);
  };

  return (
    <div className="relative space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Ambient background caustics */}
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-bl from-[#8B5CF6]/15 via-[#A855F7]/10 to-transparent blur-3xl opacity-80 dark:from-[#8B5CF6]/25 dark:via-[#38BDF8]/15" />
      <div className="pointer-events-none absolute top-72 -left-20 -z-10 h-80 w-80 rounded-full bg-gradient-to-tr from-[#6366F1]/10 via-[#C084FC]/5 to-transparent blur-3xl opacity-60 dark:from-[#6366F1]/20 dark:via-[#A855F7]/15" />

      {/* ── Header Area ─────────────────────────────────────────────────── */}
      <header className="space-y-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 dark:bg-white/[0.04] border border-purple-200/60 dark:border-white/[0.08] text-[11px] font-mono text-[#6D28D9] dark:text-[#C4B5FD] mb-3 shadow-2xs backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] animate-pulse" />
              <Compass size={12} />
              <span>Creative Discovery Feed</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
              Explore
            </h1>
            <p className="mt-1 text-sm text-ink-secondary dark:text-slate-400">
              A quiet visual feed for the brand decisions you are shaping.
            </p>
          </div>

          {/* Tab navigation */}
          <nav className="flex items-center gap-1.5 p-1 rounded-full bg-stone-100/80 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.08] text-xs backdrop-blur-xs overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("discover")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "discover"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Compass size={13} className={activeTab === "discover" ? "text-[#8B5CF6]" : ""} />
              <span>Discover</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("typography")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "typography"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Type size={13} className={activeTab === "typography" ? "text-[#8B5CF6]" : ""} />
              <span>Typography</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colors")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "colors"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Droplets size={13} className={activeTab === "colors" ? "text-[#8B5CF6]" : ""} />
              <span>Colors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("image-palette")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "image-palette"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Palette size={13} className={activeTab === "image-palette" ? "text-[#8B5CF6]" : ""} />
              <span>Image → Palette</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("references")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "references"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <BookOpen size={13} className={activeTab === "references" ? "text-[#8B5CF6]" : ""} />
              <span>References</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "saved"
                  ? "bg-white dark:bg-[#1E2235] text-ink dark:text-white shadow-[0_2px_8px_rgba(139,92,246,0.12)] font-semibold border border-purple-100/80 dark:border-[#8B5CF6]/30"
                  : "text-ink-secondary dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Bookmark size={13} className={activeTab === "saved" ? "text-[#8B5CF6]" : ""} />
              <span>Saved</span>
              {library.length > 0 && (
                <span className="font-mono text-[10px] text-ink-tertiary dark:text-slate-400">
                  ({library.length})
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* ── Project-Aware Banner (Phase 10) ───────────────────────────── */}
        {contextualProject && (
          <div className="p-4 rounded-[22px] border border-purple-200/70 dark:border-purple-500/30 bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40 dark:from-[#131628] dark:via-[#16192E] dark:to-[#131628] backdrop-blur-md shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-semibold text-ink flex items-center gap-2">
                  <span>Curated for {contextualProject.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7] animate-pulse" />
                </div>
                <div className="text-[11px] text-ink-tertiary dark:text-slate-400 mt-0.5">
                  Filtering visual tone based on Brand Brain:{" "}
                  <span className="text-[#6D28D9] dark:text-[#C4B5FD] font-medium font-mono">
                    {contextualProject.brandBrain?.visualDirection?.shouldFeelLike?.join(" · ") ||
                      "Editorial · Minimal · Contemporary"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/project/${contextualProject.id}`}
              className="text-xs text-[#6D28D9] dark:text-[#C4B5FD] hover:text-[#5B21B6] inline-flex items-center gap-1.5 font-semibold px-3.5 py-1.5 rounded-full bg-white dark:bg-white/[0.08] border border-purple-100 dark:border-purple-500/30 shadow-2xs hover:shadow-sm transition-all shrink-0"
            >
              <span>Back to Canvas</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </header>

      {/* ── TAB 1 & 4: DISCOVER / REFERENCES FEED ────────────────────── */}
      {(activeTab === "discover" || activeTab === "references") && (
        <div className="space-y-6">
          {/* Search bar & Suggested topics */}
          <div className="space-y-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4.5 top-1/2 -translate-y-1/2 text-ink-tertiary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inspiration across branding, typography, packaging, posters, visual references..."
                className="w-full h-12 pl-12 pr-12 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#121422] text-sm text-ink dark:text-white placeholder:text-ink-tertiary dark:placeholder:text-slate-500 outline-none focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/15 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isPixabayLoading && (
                  <Loader2 size={15} className="animate-spin text-[#8B5CF6]" />
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-ink-tertiary hover:text-ink p-1 rounded-full hover:bg-stone-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Suggested Topic Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTopic("All")}
                  className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    activeTopic === "All"
                      ? "bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] text-white font-medium shadow-[0_4px_12px_rgba(139,92,246,0.2)] border border-purple-500/30"
                      : "bg-white text-ink-secondary border border-black/[0.06] hover:text-ink hover:border-[#8B5CF6]/30 hover:bg-purple-50/20 shadow-2xs"
                  }`}
                >
                  All Topics
                </button>

                {SUGGESTED_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setActiveTopic(topic)}
                    className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all ${
                      activeTopic === topic
                        ? "bg-gradient-to-r from-[#191918] via-[#241B35] to-[#191918] text-white font-medium shadow-[0_4px_12px_rgba(139,92,246,0.2)] border border-purple-500/30"
                        : "bg-white text-ink-secondary border border-black/[0.06] hover:text-ink hover:border-[#8B5CF6]/30 hover:bg-purple-50/20 shadow-2xs"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Source Filter (Curated vs Pixabay Live) */}
              {hasPixabay && (
                <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100/90 border border-black/[0.04] text-[11px] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSourceFilter("all")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      sourceFilter === "all"
                        ? "bg-white text-ink font-medium shadow-sm"
                        : "text-ink-secondary hover:text-ink"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceFilter("curated")}
                    className={`px-3 py-1 rounded-full transition-all ${
                      sourceFilter === "curated"
                        ? "bg-white text-ink font-medium shadow-sm"
                        : "text-ink-secondary hover:text-ink"
                    }`}
                  >
                    Curated
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceFilter("pixabay")}
                    className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                      sourceFilter === "pixabay"
                        ? "bg-white text-ink font-medium shadow-sm"
                        : "text-ink-secondary hover:text-ink"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Pixabay Live</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Masonry Visual Feed */}
          {filteredFeedItems.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              {filteredFeedItems.map((item) => (
                <InspirationCard
                  key={item.id}
                  item={item}
                  isSaved={isItemSaved(item)}
                  onSave={handleSave}
                  onAddToCanvas={handleOpenAddToCanvas}
                  onOpenDetail={(it) => setDetailItem(it)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border-subtle bg-surface/50 p-16 text-center">
              <h3 className="text-sm font-semibold text-ink">Nothing matches this direction yet</h3>
              <p className="mt-1 text-xs text-ink-secondary">
                Try searching for a broader keyword or resetting your category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTopic("All");
                  setActiveMood("All");
                }}
                className="mt-4 text-xs font-medium text-ink hover:underline"
              >
                Reset discovery filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: TYPOGRAPHY EXPLORATION ────────────────────────────── */}
      {activeTab === "typography" && (
        <TypographyExplore
          items={allItems}
          savedIds={savedItemIds}
          onSave={handleSave}
          onAddToProject={handleOpenAddToProject}
          onAddToCanvas={handleOpenAddToCanvas}
          projectName={contextualProject?.name || "Orblinn Studio"}
        />
      )}

      {/* ── TAB 3: COLOR & PALETTE EXPLORATION ────────────────────────── */}
      {activeTab === "colors" && (
        <ColorExplore
          items={allItems}
          savedIds={savedItemIds}
          onSave={handleSave}
          onAddToProject={handleOpenAddToProject}
          onAddToCanvas={handleOpenAddToCanvas}
        />
      )}

      {/* ── TAB 3b: IMAGE → PALETTE EXTRACTION ─────────────────────────── */}
      {activeTab === "image-palette" && <ImagePalette activeProject={contextualProject} />}

      {/* ── TAB 5: SAVED CREATIVE MEMORY ──────────────────────────────── */}
      {activeTab === "saved" && (
        <SavedExplore
          items={library}
          onRemove={(id) => removeFromLibrary(id)}
          onAddToProject={(libItem) => {
            handleOpenAddToProject({
              id: libItem.id,
              provider: "agix_curated",
              title: libItem.name,
              imageUrl: libItem.imageUrl || libItem.content?.url,
              type: libItem.type as any,
              category: "Branding",
              tags: libItem.tags || [],
              metadata: libItem.content,
            });
          }}
          onAddToCanvas={(libItem) => {
            handleOpenAddToCanvas({
              id: libItem.id,
              provider: "agix_curated",
              title: libItem.name,
              imageUrl: libItem.imageUrl || libItem.content?.url,
              type: libItem.type as any,
              category: "Branding",
              tags: libItem.tags || [],
              metadata: libItem.content,
            });
          }}
        />
      )}

      {/* ── Detail Modal ──────────────────────────────────────────────── */}
      {detailItem && (
        <InspirationDetailModal
          item={detailItem}
          isSaved={isItemSaved(detailItem)}
          onClose={() => setDetailItem(null)}
          onSave={handleSave}
          onAddToProject={handleOpenAddToProject}
          onAddToCanvas={handleOpenAddToCanvas}
        />
      )}

      {/* ── Add to Project Modal ───────────────────────────────────────── */}
      {modalItem && (
        <AddToProjectModal
          item={modalItem}
          defaultPlaceOnCanvas={defaultPlaceOnCanvas}
          onClose={() => setModalItem(null)}
          onSuccess={(projName, onCanvas) => {
            triggerToast(
              onCanvas
                ? `Placed on ${projName}'s Canvas`
                : `Saved and linked to ${projName}`
            );
          }}
        />
      )}

      {/* ── Toast Notification ────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#191918] text-white text-xs font-medium shadow-lifted flex items-center gap-2 animate-fade-in">
          <Check size={14} className="text-white" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

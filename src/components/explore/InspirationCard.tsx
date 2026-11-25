"use client";

import React, { useState } from "react";
import { Heart, Plus, MoreHorizontal, ExternalLink, Sparkles } from "lucide-react";
import { NormalizedInspirationItem } from "@/lib/inspiration/types";

interface InspirationCardProps {
  item: NormalizedInspirationItem;
  isSaved: boolean;
  onSave: (item: NormalizedInspirationItem) => void;
  onAddToCanvas: (item: NormalizedInspirationItem) => void;
  onOpenDetail: (item: NormalizedInspirationItem) => void;
}

export function InspirationCard({
  item,
  isSaved,
  onSave,
  onAddToCanvas,
  onOpenDetail,
}: InspirationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Render visual content based on item type
  const renderMedia = () => {
    if (item.type === "font") {
      const family = item.metadata?.fontFamily ?? "inherit";
      const sample = item.metadata?.previewText ?? "Sphinx of black quartz";
      return (
        <div
          onClick={() => onOpenDetail(item)}
          className="w-full bg-gradient-to-br from-white to-purple-50/30 border border-black/[0.06] rounded-[22px] p-5 cursor-pointer hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          style={{ minHeight: 180 }}
        >
          <div className="flex items-center justify-between text-xs text-ink-tertiary">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6D28D9] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Typography</span>
            <span className="text-[11px] font-medium">{item.creator}</span>
          </div>
          <div
            className="my-3 text-2xl font-normal text-ink leading-snug tracking-tight group-hover:text-black transition-colors"
            style={{ fontFamily: family }}
          >
            {sample}
          </div>
          <div className="text-xs font-semibold text-ink group-hover:text-[#6D28D9] transition-colors">{item.title}</div>
        </div>
      );
    }

    if (item.type === "palette") {
      const colors = item.metadata?.colors ?? [
        { hex: "#191918", label: "Primary" },
        { hex: "#5A5A55", label: "Secondary" },
        { hex: "#BCBCB6", label: "Accent" },
        { hex: "#FBFBFA", label: "Background" },
      ];
      return (
        <div
          onClick={() => onOpenDetail(item)}
          className="w-full bg-white border border-black/[0.06] rounded-[22px] p-3.5 cursor-pointer hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="h-28 rounded-xl overflow-hidden flex border border-black/5 mb-3 shadow-inner">
            {colors.map((c, i) => (
              <div key={i} className="flex-1 h-full transition-transform duration-200 group-hover:scale-y-105" style={{ background: c.hex }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink group-hover:text-[#6D28D9] transition-colors">{item.title}</span>
            <span className="text-[10px] font-mono text-ink-tertiary">{colors.length} swatches</span>
          </div>
        </div>
      );
    }

    if (item.type === "color") {
      const hex = item.metadata?.hex ?? "#191918";
      return (
        <div
          onClick={() => onOpenDetail(item)}
          className="w-full bg-white border border-black/[0.06] rounded-[22px] p-3.5 cursor-pointer hover:border-[#8B5CF6]/40 hover:shadow-[0_14px_32px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 group"
        >
          <div
            className="h-32 rounded-xl border border-black/10 mb-3 flex items-end p-2.5 shadow-2xs"
            style={{ background: hex }}
          >
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10">
              {hex.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink group-hover:text-[#6D28D9] transition-colors">{item.title}</span>
            <span className="text-[10px] font-mono text-ink-tertiary">{hex}</span>
          </div>
        </div>
      );
    }

    // Default: Image / Reference
    return (
      <div
        className="relative overflow-hidden rounded-[22px] bg-surface-subtle border border-black/[0.07] hover:border-[#8B5CF6]/45 hover:shadow-[0_16px_36px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        onClick={() => onOpenDetail(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-48 bg-surface-muted flex items-center justify-center text-ink-tertiary">
            <Sparkles size={20} />
          </div>
        )}

        {/* Hover contextual overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 p-3.5 flex flex-col justify-between transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top row actions */}
          <div className="flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-medium font-mono px-2.5 py-0.5 rounded-full bg-black/60 text-white/95 border border-white/15 backdrop-blur-md shadow-2xs">
              {item.category}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSave(item)}
                title={isSaved ? "Saved to Library" : "Save to Library"}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isSaved
                    ? "bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                    : "bg-black/50 text-white hover:bg-white hover:text-ink"
                }`}
              >
                <Heart size={13} fill={isSaved ? "currentColor" : "none"} />
              </button>

              <button
                type="button"
                onClick={() => onAddToCanvas(item)}
                title="Add directly to Project Canvas"
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white text-ink shadow-md hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={12} />
                <span>Canvas</span>
              </button>
            </div>
          </div>

          {/* Bottom row metadata */}
          <div className="text-white drop-shadow-sm">
            <h3 className="text-xs font-semibold leading-snug line-clamp-1">{item.title}</h3>
            {item.creator && (
              <p className="text-[11px] text-white/80 line-clamp-1 font-mono">{item.creator}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <article className="mb-4 break-inside-avoid">
      {renderMedia()}

      {/* Under-card metadata for non-hover states or text/color types */}
      {item.type === "reference" && (
        <div className="pt-2 px-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4
              onClick={() => onOpenDetail(item)}
              className="text-xs font-medium text-ink truncate cursor-pointer hover:underline"
            >
              {item.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-tertiary">
              {item.creator && <span className="truncate">{item.creator}</span>}
              {item.creator && <span>·</span>}
              <span>{item.category}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(item);
            }}
            className="text-ink-tertiary hover:text-ink p-1 rounded transition-colors"
            title="View Details"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      )}
    </article>
  );
}

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface NavigationItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string | number;
  className?: string;
  onClick?: () => void;
}

export function NavigationItem({
  href,
  label,
  icon: Icon,
  isActive = false,
  badge,
  className = "",
  onClick,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center justify-between px-3.5 py-2 rounded-full text-[13px] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/30 focus-visible:ring-offset-1 ${
        isActive
          ? "bg-[#EAF5F8] text-ink font-medium shadow-none dark:bg-gradient-to-r dark:from-[#8B5CF6]/20 dark:to-[#38BDF8]/15 dark:text-white dark:border dark:border-[#8B5CF6]/30 dark:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          : "text-ink-secondary hover:text-ink hover:bg-stone-100/60 dark:hover:bg-white/[0.06] dark:hover:text-white"
      } ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          size={15}
          strokeWidth={isActive ? 2 : 1.75}
          className={
            isActive
              ? "text-ink dark:text-[#A78BFA]"
              : "text-ink-tertiary group-hover:text-ink dark:group-hover:text-white transition-colors duration-150"
          }
        />
        <span className="tracking-tight">{label}</span>
      </div>
      {badge !== undefined && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100/80 dark:bg-white/10 text-ink-tertiary dark:text-stone-300 tabular-nums font-mono">
          {badge}
        </span>
      )}
    </Link>
  );
}

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Satoshi'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "'Satoshi'",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        serif: [
          "'Instrument Serif'",
          "'Playfair Display'",
          "Georgia",
          "serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        paper: "var(--bg-paper)",
        surface: {
          DEFAULT: "var(--color-surface)",
          subtle: "var(--color-surface-subtle)",
          muted: "var(--color-surface-muted)",
          hover: "var(--color-surface-hover)",
        },
        border: {
          subtle: "var(--color-border)",
          line: "var(--color-border-line)",
          dark: "var(--color-border-dark)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          primary: "var(--color-ink)",
          secondary: "var(--color-ink-secondary)",
          tertiary: "var(--color-ink-tertiary)",
          faint: "var(--color-ink-faint)",
        },
        agix: {
          dark: "#08090E",
          surface: "#0E1018",
          card: "#121422",
          violet: "#8B5CF6",
          purple: "#A855F7",
          cyan: "#38BDF8",
          glow: "rgba(139, 92, 246, 0.25)",
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        tight: "-0.015em",
        widest: "0.14em",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        lifted: "0 4px 12px rgba(0, 0, 0, 0.05)",
        "glow-violet": "0 0 24px rgba(139, 92, 246, 0.35)",
        "glow-cyan": "0 0 24px rgba(56, 189, 248, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;

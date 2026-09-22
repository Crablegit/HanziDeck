import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        theme: {
          primary: "var(--theme-primary)",
          "primary-hover": "var(--theme-primary-hover)",
          secondary: "var(--theme-secondary)",
          accent: "var(--theme-accent)",
          bg: "var(--theme-bg)",
          surface: "var(--theme-surface)",
          text: "var(--theme-text)",
          "text-muted": "var(--theme-text-muted)",
          border: "var(--theme-border)",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.2)",
        "glow-primary": "0 0 25px -5px var(--theme-primary)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0F1E",
        surface: "#111827",
        "surface-2": "#1F2937",
        primary: "#3B82F6",
        secondary: "#8B5CF6",
        success: "#22C55E",
        warning: "#F59E0B",
        critical: "#EF4444",
        "text-primary": "#FFFFFF",
        "text-secondary": "#94A3B8",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "grid-pattern": `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "spin-slow": "spin 8s linear infinite",
        "data-flow": "dataFlow 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59,130,246,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.3)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        dataFlow: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      boxShadow: {
        "glow-primary": "0 0 20px rgba(59,130,246,0.4)",
        "glow-secondary": "0 0 20px rgba(139,92,246,0.4)",
        "glow-success": "0 0 20px rgba(34,197,94,0.4)",
        "glow-critical": "0 0 20px rgba(239,68,68,0.4)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "elevated": "0 8px 48px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;

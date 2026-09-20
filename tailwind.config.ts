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
        brand: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a", // Executive Slate Primary
          950: "#020617",
        },
        surface: {
          bg: "#f8fafc",
          card: "#ffffff",
          subtle: "#f1f5f9",
          border: "#e2e8f0",
          "strong-border": "#cbd5e1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        "saas-sm": "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        "saas-md": "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)",
      },
      borderRadius: {
        sm: "0.25rem", // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.375rem", // 6px - Stripe/Linear Control Radius
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
      },
    },
  },
  plugins: [],
};

export default config;

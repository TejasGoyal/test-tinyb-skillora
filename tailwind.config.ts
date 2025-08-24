import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        // Base tokens
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        surface: "rgb(var(--surface))",
        "surface-elevated": "rgb(var(--surface-elevated))",

        // Branding
        "school-primary": "rgb(var(--school-primary))",
        "school-secondary": "rgb(var(--school-secondary))",
        "school-accent": "rgb(var(--school-accent))",

        // Semantic
        primary: { DEFAULT: "rgb(var(--primary))", foreground: "rgb(var(--primary-foreground))" },
        secondary: { DEFAULT: "rgb(var(--secondary))", foreground: "rgb(var(--secondary-foreground))" },
        destructive: { DEFAULT: "rgb(var(--destructive))", foreground: "rgb(var(--destructive-foreground))" },
        success: { DEFAULT: "rgb(var(--success))", foreground: "rgb(var(--success-foreground))" },
        warning: { DEFAULT: "rgb(var(--warning))", foreground: "rgb(var(--warning-foreground))" },
        muted: { DEFAULT: "rgb(var(--muted))", foreground: "rgb(var(--muted-foreground))" },
        accent: { DEFAULT: "rgb(var(--accent))", foreground: "rgb(var(--accent-foreground))" },
        popover: { DEFAULT: "rgb(var(--popover))", foreground: "rgb(var(--popover-foreground))" },
        card: { DEFAULT: "rgb(var(--card))", foreground: "rgb(var(--card-foreground))" },

        // Sidebar group
        sidebar: {
          DEFAULT: "rgb(var(--sidebar-background))",
          foreground: "rgb(var(--sidebar-foreground))",
          primary: "rgb(var(--sidebar-primary))",
          "primary-foreground": "rgb(var(--sidebar-primary-foreground))",
          accent: "rgb(var(--sidebar-accent))",
          "accent-foreground": "rgb(var(--sidebar-accent-foreground))",
          border: "rgb(var(--sidebar-border))",
          ring: "rgb(var(--sidebar-ring))",
        },
      },
      borderRadius: { xl: "var(--radius)" },
    },
  },
  plugins: [],
};

export default config;

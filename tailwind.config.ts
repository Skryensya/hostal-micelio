import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Define reusable variables for colors, fonts, and other theme extensions
export const colors = {
  // Brand & Accent
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  // Neutrals
  neutral: {
    50: "var(--neutral-50)",
    100: "var(--neutral-100)",
    200: "var(--neutral-200)",
    400: "var(--neutral-400)",
    700: "var(--neutral-700)",
    900: "var(--neutral-900)",
  },
  // Surfaces
  surface: {
    1: "var(--surface-1)",
    2: "var(--surface-2)", 
    muted: "var(--surface-muted)",
    inverted: "var(--surface-inverted)",
  },
  // Text
  text: {
    DEFAULT: "var(--text)",
    muted: "var(--text-muted)",
    inverted: "var(--text-inverted)",
  },
  // Borders
  border: {
    DEFAULT: "var(--border)",
    muted: "var(--border-muted)",
    inverted: "var(--border-inverted)",
  },

  // Status
  success: {
    DEFAULT: "var(--success)",
    fg: "var(--success-foreground)",
    bg: "var(--success-bg)",
    muted: "var(--success-muted)",
  },
  warning: {
    DEFAULT: "var(--warning)",
    fg: "var(--warning-foreground)",
    bg: "var(--warning-bg)",
    muted: "var(--warning-muted)",
  },
  error: {
    DEFAULT: "var(--error)",
    fg: "var(--error-foreground)",
    bg: "var(--error-bg)",
    muted: "var(--error-muted)",
  },
  info: {
    DEFAULT: "var(--info)",
    fg: "var(--info-foreground)",
    bg: "var(--info-bg)",
    muted: "var(--info-muted)",
  },
};

const fontSize = {
  base: "1rem",
  xl: "1.333rem",
  "2xl": "1.777rem",
  "3xl": "2.369rem",
  "4xl": "3.158rem",
  "5xl": "4.210rem",
};

const fontFamily = {
  heading: "Poppins",
  body: "Baloo Bhaijaan 2",
};

const container = {
  center: true,
  padding: "1rem",
  screens: {
    sm: "576px",
    md: "720px",
    lg: "960px",
    xl: "1140px",
    "2xl": "1320px",
  },
};

const animation = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
};

// Tailwind configuration
const config: Config = {
  darkMode: ["class"], // Enables dark mode with the "class" strategy
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], // Paths to scan for Tailwind classes
  theme: {
    extend: {
      colors, // Extend colors using the reusable variable
      fontSize, // Extend font sizes
      fontFamily, // Extend font families
      container, // Extend container settings
      animation, // Extend animations
    },
  },
  plugins: [animate], // Add plugins
};

export default config;

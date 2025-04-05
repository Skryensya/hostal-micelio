import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Define reusable variables for colors, fonts, and other theme extensions
export const colors = {
  // Brand & Accent
  primary: {
    DEFAULT: "hsl(var(--primary) / <alpha-value>)",
    inverted: "hsl(var(--primary-inverted) / <alpha-value>)",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
    inverted: "hsl(var(--secondary-inverted) / <alpha-value>)",
  },
  accent: {
    DEFAULT: "hsl(var(--accent) / <alpha-value>)",
    inverted: "hsl(var(--accent-inverted) / <alpha-value>)",
  },
  // Neutrals
  neutral: {
    50: "hsl(var(--neutral-50) / <alpha-value>)",
    100: "hsl(var(--neutral-100) / <alpha-value>)",
    200: "hsl(var(--neutral-200) / <alpha-value>)",
    400: "hsl(var(--neutral-400) / <alpha-value>)",
    700: "hsl(var(--neutral-700) / <alpha-value>)",
    900: "hsl(var(--neutral-900) / <alpha-value>)",
  },
  // Surfaces
  surface: {
    1: "hsl(var(--surface-1) / <alpha-value>)",
    2: "hsl(var(--surface-2) / <alpha-value>)",
    3: "hsl(var(--surface-3) / <alpha-value>)",
    muted: "hsl(var(--surface-muted) / <alpha-value>)",
    inverted: "hsl(var(--surface-inverted) / <alpha-value>)",
    "on-light": "hsl(var(--surface-on-light) / <alpha-value>)",
    "on-dark": "hsl(var(--surface-on-dark) / <alpha-value>)",
  },
  // Text
  text: {
    DEFAULT: "hsl(var(--text))",
    muted: "hsl(var(--text) / 0.5)",
    inverted: "hsl(var(--text-inverted) / <alpha-value>)",
    "on-light": "hsl(var(--text-on-light) / <alpha-value>)",
    "on-dark": "hsl(var(--text-on-dark) / <alpha-value>)",
  },
  // Borders
  border: {
    DEFAULT: "hsl(var(--border) / <alpha-value>)",
    muted: "hsl(var(--border-muted) / <alpha-value>)",
    inverted: "hsl(var(--border-inverted) / <alpha-value>)",
    "on-light": "hsl(var(--border-on-light) / <Salpha-value>)",
    "on-dark": "hsl(var(--border-on-dark) / <alpha-value>)",
  },

  // Statusx
  success: {
    DEFAULT: "hsl(var(--success) / <alpha-value>)",
    muted: "hsl(var(--success-muted) / <alpha-value>)",
  },
  warning: {
    DEFAULT: "hsl(var(--warning) / <alpha-value>)",
    muted: "hsl(var(--warning-muted) / <alpha-value>)",
  },
  error: {
    DEFAULT: "hsl(var(--error) / <alpha-value>)",
    muted: "hsl(var(--error-muted) / <alpha-value>)",
  },
  info: {
    DEFAULT: "hsl(var(--info) / <alpha-value>)",
    muted: "hsl(var(--info-muted) / <alpha-value>)",
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
  darkMode: ["class", "[data-mode='dark']"], // Enables dark mode with the "class" strategy
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

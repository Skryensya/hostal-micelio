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
      container: {
        center: true, // Centers the container (Bootstrap's containers are centered)
        padding: "1rem", // Add padding (similar to Bootstrap's container padding)
        screens: {
          sm: "576px", // Matches Bootstrap's sm container width
          md: "720px", // Matches Bootstrap's md container width
          lg: "960px", // Matches Bootstrap's lg container width
          xl: "1140px", // Matches Bootstrap's xl container width
          "2xl": "1320px", // Matches Bootstrap's xxl container width
        },
      },
      fontSize: {
        sm: "0.750rem",
        base: "1rem",
        xl: "1.333rem",
        "2xl": "1.777rem",
        "3xl": "2.369rem",
        "4xl": "3.158rem",
        "5xl": "4.210rem",
      },
      fontFamily: {
        heading: "Poppins",
        body: "Baloo Bhaijaan 2",
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },
      colors: {
        text: {
          light: "var(--text-light)",
          dark: "var(--text-dark)",
        },
        surface: {
          light: "var(--surface-light)",
          dark: "var(--surface-dark)",
        },
        primary: {
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
        },
        border: {
          light: "var(--border-light)",
          dark: "var(--border-dark)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

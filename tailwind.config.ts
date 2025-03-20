import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        // "room-gradient": "linear-gradient(19deg, var(--primary-light) 0%, var( --text-dark) 100%)",
        "room-gradient":
          "linear-gradient(160deg, var(--primary-light-60) 0%, var(--text-dark) 100%)",
      },
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
          light: {
            DEFAULT: "var(--surface-light)",
            10: "var(--surface-light-10)",
            20: "var(--surface-light-20)",
            30: "var(--surface-light-30)",
            40: "var(--surface-light-40)",
            50: "var(--surface-light-50)",
            60: "var(--surface-light-60)",
            70: "var(--surface-light-70)",
            80: "var(--surface-light-80)",
            90: "var(--surface-light-90)",
          },
          dark: {
            DEFAULT: "var(--surface-dark)", // 100% opacity
            10: "var(--surface-dark-10)",
            20: "var(--surface-dark-20)",
            30: "var(--surface-dark-30)",
            40: "var(--surface-dark-40)",
            50: "var(--surface-dark-50)",
            60: "var(--surface-dark-60)",
            70: "var(--surface-dark-70)",
            80: "var(--surface-dark-80)",
            90: "var(--surface-dark-90)",
          },
        },
        "surface-2": {
          light: {
            DEFAULT: "var(--surface-2-light)",
            10: "var(--surface-2-light-10)",
            20: "var(--surface-2-light-20)",
            30: "var(--surface-2-light-30)",
            40: "var(--surface-2-light-40)",
            50: "var(--surface-2-light-50)",
            60: "var(--surface-2-light-60)",
            70: "var(--surface-2-light-70)",
            80: "var(--surface-2-light-80)",
            90: "var(--surface-2-light-90)",
          },
          dark: {
            DEFAULT: "var(--surface-2-dark)", // 100% opacity
            10: "var(--surface-2-dark-10)",
            20: "var(--surface-2-dark-20)",
            30: "var(--surface-2-dark-30)",
            40: "var(--surface-2-dark-40)",
            50: "var(--surface-2-dark-50)",
            60: "var(--surface-2-dark-60)",
            70: "var(--surface-2-dark-70)",
            80: "var(--surface-2-dark-80)",
            90: "var(--surface-2-dark-90)",
          },
        },
        primary: {
          light: {
            DEFAULT: "var(--primary-light)", // 100% opacity
            10: "var(--primary-light-10)",
            20: "var(--primary-light-20)",
            30: "var(--primary-light-30)",
            40: "var(--primary-light-40)",
            50: "var(--primary-light-50)",
            60: "var(--primary-light-60)",
            70: "var(--primary-light-70)",
            80: "var(--primary-light-80)",
            90: "var(--primary-light-90)",
          },
          dark: {
            DEFAULT: "var(--primary-dark)", // 100% opacity
            10: "var(--primary-dark-10)",
            20: "var(--primary-dark-20)",
            30: "var(--primary-dark-30)",
            40: "var(--primary-dark-40)",
            50: "var(--primary-dark-50)",
            60: "var(--primary-dark-60)",
            70: "var(--primary-dark-70)",
            80: "var(--primary-dark-80)",
            90: "var(--primary-dark-90)",
          },
        },
        secondary: {
          light: {
            DEFAULT: "var(--secondary-light)", // 100% opacity
            10: "var(--secondary-light-10)",
            20: "var(--secondary-light-20)",
            30: "var(--secondary-light-30)",
            40: "var(--secondary-light-40)",
            50: "var(--secondary-light-50)",
            60: "var(--secondary-light-60)",
            70: "var(--secondary-light-70)",
            80: "var(--secondary-light-80)",
            90: "var(--secondary-light-90)",
          },
          dark: {
            DEFAULT: "var(--secondary-dark)", // 100% opacity
            10: "var(--secondary-dark-10)",
            20: "var(--secondary-dark-20)",
            30: "var(--secondary-dark-30)",
            40: "var(--secondary-dark-40)",
            50: "var(--secondary-dark-50)",
            60: "var(--secondary-dark-60)",
            70: "var(--secondary-dark-70)",
            80: "var(--secondary-dark-80)",
            90: "var(--secondary-dark-90)",
          },
        },
        accent: {
          light: {
            DEFAULT: "var(--accent-light)", // 100% opacity
            10: "var(--accent-light-10)",
            20: "var(--accent-light-20)",
            30: "var(--accent-light-30)",
            40: "var(--accent-light-40)",
            50: "var(--accent-light-50)",
            60: "var(--accent-light-60)",
            70: "var(--accent-light-70)",
            80: "var(--accent-light-80)",
            90: "var(--accent-light-90)",
          },
          dark: {
            DEFAULT: "var(--accent-dark)", // 100% opacity
            10: "var(--accent-dark-10)",
            20: "var(--accent-dark-20)",
            30: "var(--accent-dark-30)",
            40: "var(--accent-dark-40)",
            50: "var(--accent-dark-50)",
            60: "var(--accent-dark-60)",
            70: "var(--accent-dark-70)",
            80: "var(--accent-dark-80)",
            90: "var(--accent-dark-90)",
          },
        },
        border: {
          light: {
            DEFAULT: "var(--border-light)", // 100% opacity
          },
          dark: {
            DEFAULT: "var(--border-dark)", // 100% opacity
          },
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
  plugins: [animate],
};
export default config;

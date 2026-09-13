import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#EFF8FB",
          100: "#DCEFF5",
          200: "#B3DFEA",
          300: "#7FC8DA",
          400: "#45AAC3",
          500: "#1E8AA8",
          600: "#146D8A",
          700: "#125771",
          800: "#12455B",
          900: "#0F3549",
          950: "#081D26",
        },
        gold: {
          300: "#F6D28A",
          400: "#F2B84B",
          500: "#E8A233",
          600: "#C4841F",
        },
        leaf: {
          400: "#5FB88A",
          500: "#3D9A6C",
          600: "#2E7D54",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;

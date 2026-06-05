import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tiktok: {
          black: "#010101",
          red: "#FE2C55",
          cyan: "#25F4EE",
          ink: "#0B0B10",
          panel: "#15151D",
          muted: "#8B93A7",
        },
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(37,244,238,0.18), 0 16px 48px rgba(0,0,0,0.35)",
        red: "0 0 0 1px rgba(254,44,85,0.22), 0 16px 42px rgba(254,44,85,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

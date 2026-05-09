import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        grind: {
          bg: "#111111",
          surface: "#181818",
          line: "#262626",
          red: "#EF4444",
          cyan: "#22D3EE"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.2), 0 10px 40px rgba(34,211,238,0.15)"
      }
    }
  },
  plugins: []
};

export default config;

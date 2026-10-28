import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: "#141414",
          850: "#1A1A1A",
          800: "#242424",
          700: "#333333",
          600: "#4D4D4D",
        },
        cream: {
          50: "#FAF9F5",
          100: "#F9F8F6",
          200: "#F2EFE9",
          300: "#E8E4DA",
          400: "#DCD6C8",
        },
        gold: {
          300: "#D8C2A3",
          400: "#C5A880",
          500: "#B8966C",
          600: "#9E7B53",
          700: "#7E6140",
        },
        emerald: {
          700: "#1B4D3E",
          800: "#143A2F",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        classic: "0 4px 20px -2px rgba(26, 26, 26, 0.06)",
        'classic-hover': "0 10px 25px -4px rgba(26, 26, 26, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

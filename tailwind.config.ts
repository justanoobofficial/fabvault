import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F9F9F9",
        ink: "#111111",
        void: "#000000",
        bone: "#EDEAE4",
        ash: "#8A8A8A",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        editorial: "-0.03em",
        mega: "0.42em",
      },
      transitionTimingFunction: {
        vault: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      aspectRatio: {
        editorial: "3 / 4",
        wide: "16 / 9",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "spin-slow": "spinSlow 18s linear infinite",
        flicker: "flicker 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

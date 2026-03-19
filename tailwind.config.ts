import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      colors: {
        background: "#000000",
        secondary: "#0a0a0a",
        surface: "#121212",
        elevated: "#121212",
        borderline: "#1f1f1f",
        muted: "#a1a1a1"
      },
      boxShadow: {
        halo: "0 0 90px rgba(255, 255, 255, 0.08)",
        panel: "0 25px 80px rgba(0, 0, 0, 0.5)"
      },
      backgroundImage: {
        "luxury-radial":
          "radial-gradient(circle at top, rgba(255,255,255,0.1), transparent 32%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg, #0a0a0a 0%, #020202 100%)"
      }
    }
  },
  plugins: []
};

export default config;

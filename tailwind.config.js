/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        boba: {
          red: "#D1493D",
          "red-dark": "#992E24",
          "red-light": "#D9685E",
          gold: "#FFD700",
          dark: "#0E0E0E",
          gray: "#242424",
          panel: "#212121",
          border: "#FFFFFF44",
          light: "#FFFFFF",
        },
        fire: { DEFAULT: "#D1493D", light: "#D9685E", dark: "#992E24" },
        ice: { DEFAULT: "#1EB2F2", light: "#5BC4F5", dark: "#0D8AC7" },
        steel: { DEFAULT: "#A8B2C0", light: "#C0C8D4", dark: "#7A8494" },
        glow: { DEFAULT: "#79F528", light: "#92F751", dark: "#51BF09" },
        hex: { DEFAULT: "#E23167", light: "#FF4D8A", dark: "#B81E4E" },
        gum: { DEFAULT: "#FF69B4", light: "#FF8CC8", dark: "#E84D9B" },
        brawl: { DEFAULT: "#F2841E", light: "#F59B47", dark: "#D06A0D" },
        super: { DEFAULT: "#FFD700", light: "#FFE44D", dark: "#D4B300" },
        alt: { DEFAULT: "#FF6B35", light: "#FF8A5C", dark: "#D4551A" },
        cyber: { DEFAULT: "#00D4FF", light: "#33DEFF", dark: "#00A8CC" },
      },
      fontFamily: {
        display: ["'Saira Extra Condensed'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        boba: "16px",
      },
      boxShadow: {
        "weapon-fire": "0 0 20px rgba(209, 73, 61, 0.3)",
        "weapon-ice": "0 0 20px rgba(30, 178, 242, 0.3)",
        "weapon-glow": "0 0 20px rgba(121, 245, 40, 0.3)",
        "weapon-hex": "0 0 20px rgba(226, 49, 103, 0.3)",
        "weapon-brawl": "0 0 20px rgba(242, 132, 30, 0.3)",
        "weapon-super": "0 0 20px rgba(255, 215, 0, 0.3)",
        "weapon-gum": "0 0 20px rgba(255, 105, 180, 0.3)",
        "weapon-steel": "0 0 20px rgba(168, 178, 192, 0.3)",
        neon: "0 0 30px rgba(226, 49, 103, 0.4), 0 0 60px rgba(121, 245, 40, 0.2)",
      },
    },
  },
  plugins: [],
};

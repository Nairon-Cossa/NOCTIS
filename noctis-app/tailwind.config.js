/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure both App.tsx and all child folders inside src are completely scanned
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0D", // Dark-room canvas base
        surface: "#151518",
        card: "#1D1D21",
        border: "#2B2B30",
        textPrimary: "#FFFFFF",
        textSecondary: "#B7BBC5",
        disabled: "#6D7078",
        accent: "#4B82FF",
        success: "#35C759",
        warning: "#FFCC00",
        error: "#FF453A",
      },
    },
  },
  plugins: [],
}
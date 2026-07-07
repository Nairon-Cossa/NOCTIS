/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0D",
        surface: "#151518",
        card: "#1D1D21",
        textPrimary: "#FFFFFF",
        textSecondary: "#B7BBC5",
        disabled: "#6D7078",
        accent: "#4B82FF",
        success: "#35C759",
        warning: "#FFCC00",
        error: "#FF453A",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
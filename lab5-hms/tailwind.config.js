/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ IMPORTANT

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },

  plugins: [],
};
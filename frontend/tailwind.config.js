/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F7F5",
        ink: "#111111",
        muted: "#666666",
        receipt: "#FFFDF7",
        sage: {
          DEFAULT: "#6F9A82",
          light: "#E4EEE8",
          dark: "#4E7360",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Bebas Neue", "Inter", "sans-serif"],
      },
      boxShadow: {
        paper: "0 2px 4px rgba(17,17,17,0.04), 0 12px 28px rgba(17,17,17,0.10)",
      },
    },
  },
  plugins: [],
};

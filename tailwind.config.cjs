/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: '#ef4444',
        warning: '#f59e0b',
        healthy: '#22c55e',
      },
    },
  },
  plugins: [],
};

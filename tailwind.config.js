/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'calendar-bg': '#f8f9fa',
        'calendar-paper': '#ffffff',
        'calendar-text': '#2d3436',
        'calendar-accent': '#6c5ce7',
        'calendar-muted': '#b2bec3',
      },
      fontFamily: {
        serif: ['System'],
        sans: ['System'],
      }
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
}

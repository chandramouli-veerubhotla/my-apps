/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: colors.slate,
        ascent: colors.orange
      },
      fontFamily: {
        'primary': ['Google Sans', 'sans-serif'],
        'ascent': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
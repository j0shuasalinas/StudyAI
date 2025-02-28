/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.js', // Adjust based on your file structure
    './components/**/*.{js,jsx,ts,tsx}',
    // Add any other directories where you're using Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pokemon: {
          light: '#f0f0f0',
          dark: '#121212',
          primary: '#FF5252',
        }
      }
    },
  },
  plugins: [],
};

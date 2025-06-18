/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlack: '#061826',
        primaryGreen: '#09C4AE',
      },
      fontFamily: {
        hove: ['Hove', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

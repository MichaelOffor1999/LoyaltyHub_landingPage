/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f3',
          100: '#f8eadd',
          200: '#f1d3b8',
          300: '#e7b98e',
          400: '#d99a5c',
          500: '#c97b3a',
          600: '#a9642d',
          700: '#864c23',
          800: '#6b3d1c',
          900: '#583217',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        purple: {
          50: '#fff0f3',
          100: '#ffe3e8',
          200: '#ffccd5',
          300: '#ffb3c1',
          400: '#ff85a1',
          500: '#ff5c8a',
          600: '#ff0a54',
          700: '#e00045',
          800: '#b00037',
          900: '#800028',
          950: '#4c0519',
        },
        blue: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        }
      }
    },
  },
  plugins: [],
}
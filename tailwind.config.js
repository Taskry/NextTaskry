/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ 다크모드 활성화
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: {
          100: '#B3E0E0',
          200: '#80CCCC',
          300: '#4DB8B8',
          400: '#26A3A3',
          500: '#008F8F',
          600: '#007373',
          700: '#005959',
        },
        gray: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#CCCCCC',
          400: '#999999',
          500: '#666666',
          600: '#333333',
          700: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
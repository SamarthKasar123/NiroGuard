/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'niro-blue': '#0077B6',
        'niro-aqua': '#48CAE4',
        'niro-green': '#2D6A4F',
        'niro-light-blue': '#90E0EF',
        'niro-dark-blue': '#023E8A',
        'niro-success': '#2D6A4F',
        'niro-warning': '#FFB830',
        'niro-danger': '#E63946',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
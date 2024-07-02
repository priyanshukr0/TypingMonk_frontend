/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#ff6347',
        '--fg-100': 'hsl(220 20% 98%)',
        '--fg-200': 'hsl(220 20% 80%)',
        '--bg-100': 'hsl(220 20% 14%)',
      },
      boxShadow: {
        'score-box-shadow': '-1px 2px 59px -25px rgba(16,230,152,1)',
      }
    },

  },
  plugins: [],
}


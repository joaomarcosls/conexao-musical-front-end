/** @type {import('tailwindcss').Config} */
module.exports = {
  // prefix: 'tw-',
  darkMode: 'class',
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './public/index.html'
  ],
  theme: {
    keyframes: {
       "shimmer": {
      "100%": {
        "transform": "translateX(100%)",
      },
    },
    },
    extend: {
      colors: {
        background_body: {
          light: '#f1f5f9',
          dark: '#0f172a',
        },
        primary: {
          light: '#3b82f6',
          dark: '#230046',
        },
        secondary: {
          light: '#64748b',
          dark: '#320064',
        },
      },
    },
  },
  plugins: [],
}



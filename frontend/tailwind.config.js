/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E1A2B',
          light: '#14263D',
        },
        paper: '#F7F5EF',
        signal: {
          DEFAULT: '#E8A33D',
          dark: '#C97B22',
        },
        safe: '#3E8E6E',
        caution: '#C97B3D',
        alert: '#B24B3C',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
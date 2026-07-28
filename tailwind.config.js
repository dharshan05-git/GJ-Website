/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7A2E3B',
        'primary-hover': '#5F222D',
        gold: '#D4AF37',
        'gold-light': '#F4E5B8',
        bg: '#FAF6F0',
        'bg-secondary': '#F3EAE1',
        dark: '#1A1615',
        muted: '#736B66',
        border: '#E8DFD7',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

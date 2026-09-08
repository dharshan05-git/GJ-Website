/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-ivory': '#F5F1EA',
        'soft-cream': '#EDE7DE',
        'light-beige': '#D8CFC3',
        'champagne-gold': '#C6A46A',
        'burgundy': '#7B3F42',
        'dusty-rose': '#9B6668',
        'dark-charcoal': '#2E2B2B',
        'warm-brown': '#5C4038',
        // Standard mappings
        primary: '#7B3F42',
        'primary-hover': '#623033',
        gold: '#C6A46A',
        bg: '#F5F1EA',
        'bg-secondary': '#EDE7DE',
        dark: '#2E2B2B',
        muted: '#5C4038',
        border: '#D8CFC3',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

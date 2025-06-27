/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#111425',
        'brand-purple': '#0a0037',
        'brand-orange': '#eaa338',
        'brand-yellow': '#efe175',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #eaa338 0%, #efe175 100%)',
        'brand-dark-gradient': 'linear-gradient(135deg, #111425 0%, #0a0037 100%)',
      },
      fontFamily: {
        'logo': ['Orbitron', 'Inter', 'sans-serif'],
        'heading': ['Orbitron', 'Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'black': '900',
        'extrabold': '800',
      }
    },
  },
  plugins: [],
};
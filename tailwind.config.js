/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'Impact', 'Arial Narrow', 'sans-serif'],
      },
      colors: {
        pop: {
          teal: '#2FB1A2',
          mustard: '#F4C92E',
          maroon: '#4B2927',
          cream: '#F3F3F3',
          white: '#FFFFFF',
        },
        zen: {
          forest: '#4B2927',
          parchment: '#F3F3F3',
          sage: '#c8ebe4',
          terracotta: '#b84a3d',
        },
        ff: {
          mint: 'var(--bg-mint)',
          beige: 'var(--bg-beige)',
          white: 'var(--bg-white)',
          cardPink: 'var(--card-pink)',
          cardPurple: 'var(--card-purple)',
          cardOrange: 'var(--card-orange)',
          cardGreen: 'var(--card-green)',
          accent: 'var(--card-accent)',
        },
      },
      borderRadius: {
        'ff-major': 'var(--radius-major)',
        'ff-minor': 'var(--radius-minor)',
      },
      borderWidth: {
        ff: 'var(--border-width)',
      },
      boxShadow: {
        pop: '0 10px 28px rgba(75, 41, 39, 0.1)',
        'pop-md': '0 14px 36px rgba(75, 41, 39, 0.14)',
        'pop-hover': '0 18px 40px rgba(75, 41, 39, 0.16)',
        neo: '0 10px 28px rgba(75, 41, 39, 0.1)',
        'neo-sm': '0 6px 18px rgba(75, 41, 39, 0.08)',
        'neo-none': 'none',
      },
    },
  },
  plugins: [],
};

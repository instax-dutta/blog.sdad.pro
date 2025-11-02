import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sci-fi-dark': '#0a0f1f',
        'sci-fi-darker': '#0f172a',
        'sci-fi-accent': '#60a5fa',
        'sci-fi-accent-dark': '#3b82f6',
        'sci-fi-purple': '#60a5fa',
        'sci-fi-pink': '#f472b6',
        'sci-fi-cyan': '#22d3ee',
      },
      fontFamily: {
        'sci-fi': ['Archivo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sci-fi': '0 0 10px rgba(96, 165, 250, 0.05)',
        'sci-fi-glow': '0 0 20px rgba(96, 165, 250, 0.1)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


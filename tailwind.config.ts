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
        'terminal-bg': '#0a0e0f',
        'terminal-fg': '#00ff41',
        'terminal-fg-dim': '#00cc33',
        'terminal-fg-bright': '#33ff66',
        'terminal-border': '#00ff41',
        'terminal-accent': '#00ff88',
        'terminal-yellow': '#ffff00',
        'terminal-cyan': '#00ffff',
        'terminal-magenta': '#ff00ff',
        'terminal-red': '#ff0000',
        'terminal-blue': '#0088ff',
      },
      fontFamily: {
        'terminal': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'terminal': '0 0 10px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)',
        'terminal-glow': '0 0 20px rgba(0, 255, 65, 0.5)',
      },
      animation: {
        'blink': 'blink 1s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

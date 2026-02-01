/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'bitmap': ['"Press Start 2P"', 'monospace'],
        'medieval': ['"Cinzel"', 'serif'],
        'mono': ['"IBM Plex Mono"', '"VCR OSD Mono"', 'monospace'],
      },
      colors: {
        'matrix': '#00ff41',
        'tribal': '#ff1493',
        'cyber': '#00ffff',
      },
      textShadow: {
        'glow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'matrix': '0 0 10px #00ff41, 0 0 20px #00ff41',
        'tribal': '0 0 10px #ff1493, 0 0 20px #ff1493',
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 0.3s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.2)' },
        },
      },
    },
  },
  plugins: [],
}

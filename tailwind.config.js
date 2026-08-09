/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        axio: {
          bg: "#050608",
          panel: "#090C11",
          card: "#0C1117",
          hover: "#10161D",
          border: "#202731",
          "border-bright": "#27323D",
          "border-highlight": "#34404C",
          red: "#FF3046",
          "red-glow": "rgba(255, 48, 70, 0.25)",
          cyan: "#20D6D2",
          "cyan-glow": "rgba(32, 214, 210, 0.25)",
          green: "#22C55E",
          amber: "#F59E0B",
          text: "#FFFFFF",
          "text-sub": "#D9E0E8",
          "text-secondary": "#AEB8C4",
          muted: "#7F8B98"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif'],
        tech: ['"Space Grotesk"', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.05)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}

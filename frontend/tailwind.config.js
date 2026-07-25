/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF2E88', // OLED Pink
          hover: '#E02776',
          light: '#FF4D9C',
        },
        slate: {
          50: '#000000',
          100: '#050505',
          200: '#0D0D0D',
          300: '#1A1A1A',
          400: '#666666',
          500: '#999999',
          600: '#CCCCCC',
          700: 'rgba(255,255,255,0.05)',
          800: '#0D0D0D',
          900: '#000000',
          950: '#000000',
        },
        rose: {
          50: 'rgba(255, 46, 136, 0.05)',
          100: 'rgba(255, 46, 136, 0.1)',
          200: '#FF93C3',
          300: '#FF70B0',
          400: '#FF4D9C',
          500: '#FF2E88',
          600: '#E02776',
          700: '#C71B62',
          800: '#A30F4C',
          900: '#800537',
        },
        dark: {
          bg: '#000000', // Pure Black (OLED)
          card: '#0D0D0D', // Very dark gray
          border: 'rgba(255,255,255,0.05)', // Dark gray border
          muted: '#a1a1aa', // Zinc-400
          hover: '#141414',
        },
        light: {
          bg: '#000000', // Force OLED in light mode too for consistency
          card: '#050505', // Very dark gray
          border: 'rgba(255,255,255,0.05)', 
          muted: '#a1a1aa',
          hover: '#141414',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

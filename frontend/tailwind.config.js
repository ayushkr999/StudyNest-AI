/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#174D3A',
          secondary: '#287A59',
          accent: '#A6D9B8',
          accentDark: '#3DA87B',
          bg: '#F8FAF7',
          surface: '#FFFFFF',
          text: '#17251F',
          muted: '#78847D',
          border: '#E3E9E2',
          borderSubtle: '#EDF1EC',
          hover: '#133F2F',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#134e39',
          900: '#0f382a',
          950: '#061d15',
        },
        surface: {
          light: '#FAF9F6',
          card: '#FFFFFF',
          dark: '#0D1117',
          darkcard: '#161B22',
          border: '#E5E7EB',
          darkborder: '#30363D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1F33',
          light: '#183B5E',
          dark: '#061320',
        },
        secondary: {
          DEFAULT: '#2F80ED',
          hover: '#1B6ED9',
          light: '#EBF4FF',
        },
        accent: {
          DEFAULT: '#FF8A3D',
          hover: '#F27520',
          light: '#FFF4EB',
        },
        brandBg: '#F7F9FC',
        brandDark: '#17202A',
        brandMuted: '#64748B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(11, 31, 51, 0.04), 0 1px 3px rgba(11, 31, 51, 0.02)',
        'card': '0 8px 24px -4px rgba(11, 31, 51, 0.07), 0 2px 6px -1px rgba(11, 31, 51, 0.04)',
        'card-hover': '0 20px 32px -8px rgba(11, 31, 51, 0.12), 0 8px 12px -4px rgba(11, 31, 51, 0.06)',
        'modal': '0 25px 50px -12px rgba(11, 31, 51, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      }
    },
  },
  plugins: [],
}

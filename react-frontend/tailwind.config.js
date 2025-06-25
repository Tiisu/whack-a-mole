/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          purple: '#8b5cf6',
          'purple-dark': '#7c3aed',
        },
        accent: {
          yellow: '#fbbf24',
          red: '#ef4444',
          orange: '#f97316',
        },
        'primary-orange': '#f97316',
        'primary-orange-glow': '#fb923c',
        'bg-card': 'rgba(255, 255, 255, 0.1)',
        'bg-card-dark': 'rgba(0, 0, 0, 0.8)',
        'neutral-light-gray': '#e5e7eb',
        'neutral-gray': '#6b7280',
        'error-500': '#ef4444',
        'error-600': '#dc2626',
        'error-700': '#b91c1c',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'primary-orange-glow': '0 0 20px rgba(251, 146, 60, 0.5)',
      }
    },
  },
  plugins: [],
}
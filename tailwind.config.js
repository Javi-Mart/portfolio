/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'hsl(var(--page))',
        ink: 'hsl(var(--ink))',
        muted: 'hsl(var(--muted))',
        panel: 'hsl(var(--panel))',
        accent: 'hsl(var(--accent))',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 42px hsl(var(--accent) / 0.18)',
      },
    },
  },
  plugins: [],
};

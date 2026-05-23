/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        frontier: {
          bg: '#0a0e0c',
          surface: '#0d1411',
          'surface-deep': '#050807',
          border: '#1c2620',
          'border-strong': '#2a3a30',
          text: '#d8e6dc',
          'text-muted': '#b8c8be',
          'text-dim': '#6a8a7a',
          signal: '#4ade80',
          'signal-deep': '#0a6b4e',
          danger: '#f87171',
          warn: '#fbbf24',
        },
        section: {
          'chain-watch': '#4ade80',
          'ai-lab': '#60a5fa',
          'deep-tech': '#c084fc',
          markets: '#fbbf24',
          research: '#2dd4bf',
          opinion: '#f472b6',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.2em',
        ui: '0.12em',
      },
      maxWidth: {
        prose: '70ch',
        wide: '1400px',
      },
    },
  },
  plugins: [],
};

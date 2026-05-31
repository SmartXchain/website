/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        frontier: {
          bg: '#F8F6F1',           // warm cream — page background
          surface: '#EEEAE3',      // cards, sidebar
          'surface-deep': '#E6E2DB', // code blocks, ticker
          border: '#D4CFC8',       // all borders
          'border-strong': '#B0AA9F', // hover borders
          nav: '#1A2320',          // dark bookend — nav + footer bg
          text: '#1A2320',         // primary text (same dark ink)
          'text-muted': '#5C6B67', // body copy, excerpts
          'text-dim': '#8FA49E',   // meta, kickers, timestamps
          signal: '#596D69',       // Hidden Gem — primary accent
          'signal-deep': '#3D5C55', // gradient stop, bar chart
          danger: '#B85555',       // error states
          warn: '#B87D1A',         // warning states
        },
        section: {
          'chain-watch': '#3D7A6B',
          'ai-lab': '#3B6FA0',
          'deep-tech': '#7C4CA8',
          markets: '#B87D1A',
          research: '#2B7A6D',
          opinion: '#B54B85',
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

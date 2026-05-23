export type SectionSlug =
  | 'chain-watch'
  | 'ai-lab'
  | 'deep-tech'
  | 'markets'
  | 'research'
  | 'opinion';

export interface Section {
  slug: SectionSlug;
  name: string;
  short: string;
  blurb: string;
  accentHex: string;
}

export const sections: Section[] = [
  {
    slug: 'chain-watch',
    name: 'Chain Watch',
    short: 'Chain',
    blurb: 'L1/L2 protocols, onchain flows, regulation.',
    accentHex: '#4ade80',
  },
  {
    slug: 'ai-lab',
    name: 'AI Lab',
    short: 'AI',
    blurb: 'Frontier models, agents, benchmarks, alignment.',
    accentHex: '#60a5fa',
  },
  {
    slug: 'deep-tech',
    name: 'Deep Tech',
    short: 'Deep',
    blurb: 'Fusion, quantum, biotech, robotics, hard tech.',
    accentHex: '#c084fc',
  },
  {
    slug: 'markets',
    name: 'Markets',
    short: 'Markets',
    blurb: 'Funding, M&A, public-market signal.',
    accentHex: '#fbbf24',
  },
  {
    slug: 'research',
    name: 'Research',
    short: 'Research',
    blurb: 'Long-form deep dives, original analysis.',
    accentHex: '#2dd4bf',
  },
  {
    slug: 'opinion',
    name: 'Opinion',
    short: 'Opinion',
    blurb: "Editor's note, guest essays, hot takes.",
    accentHex: '#f472b6',
  },
];

export const getSection = (slug: SectionSlug): Section =>
  sections.find((s) => s.slug === slug)!;

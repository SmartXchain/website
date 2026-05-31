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
    accentHex: '#3D7A6B',
  },
  {
    slug: 'ai-lab',
    name: 'AI Lab',
    short: 'AI',
    blurb: 'Frontier models, agents, benchmarks, alignment.',
    accentHex: '#3B6FA0',
  },
  {
    slug: 'deep-tech',
    name: 'Deep Tech',
    short: 'Deep',
    blurb: 'Fusion, quantum, biotech, robotics, hard tech.',
    accentHex: '#7C4CA8',
  },
  {
    slug: 'markets',
    name: 'Markets',
    short: 'Markets',
    blurb: 'Funding, M&A, public-market signal.',
    accentHex: '#B87D1A',
  },
  {
    slug: 'research',
    name: 'Research',
    short: 'Research',
    blurb: 'Long-form deep dives, original analysis.',
    accentHex: '#2B7A6D',
  },
  {
    slug: 'opinion',
    name: 'Opinion',
    short: 'Opinion',
    blurb: "Editor's note, guest essays, hot takes.",
    accentHex: '#B54B85',
  },
];

export const getSection = (slug: SectionSlug): Section =>
  sections.find((s) => s.slug === slug)!;

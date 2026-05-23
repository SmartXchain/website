// Site-wide constants. Single source of truth for things referenced
// from multiple components and pages.

export const SITE = {
  name: 'SmartXChain',
  tagline: 'Signal from the frontier',
  description:
    'A specialist publication for Web3, AI, and deep tech. Signal from the frontier.',
  url: 'https://smartxchain.com',
  // Newsletter — Buttondown.email integration.
  // Set this to your Buttondown username (e.g. "smartxchain") once your
  // account is provisioned. Until set, the subscribe form will POST to
  // a non-existent endpoint; replace the literal below in one edit.
  buttondownUsername: 'YOUR-BUTTONDOWN-USERNAME',
  newsletter: {
    name: 'The Chain Letter',
    pitch:
      'One smart story, three quick takes, every weekday morning. Free. No spam, no SEO bait, just signal.',
  },
  social: {
    twitter: '', // e.g. "smartxchain" — used for OG card creator
    github: 'SmartXchain',
  },
} as const;

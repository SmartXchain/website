// Source registry for the private research stack.
// Direct-RSS sources are listed first; Google-News-scraped sources are noted.

export interface RssSource {
  name: string;
  url: string;
  via: 'direct' | 'google-news';
  // Reason this source uses a fallback (only for via:'google-news')
  note?: string;
}

export const RSS_SOURCES: RssSource[] = [
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    via: 'direct',
  },
  {
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    via: 'direct',
  },
  {
    name: 'Anthropic',
    url: 'https://news.google.com/rss/search?q=site:anthropic.com&hl=en-US&gl=US&ceid=US:en',
    via: 'google-news',
    note: 'Anthropic does not publish an RSS feed; Google News indexes anthropic.com.',
  },
  {
    name: 'Meta AI',
    url: 'https://news.google.com/rss/search?q=site:ai.meta.com&hl=en-US&gl=US&ceid=US:en',
    via: 'google-news',
    note: 'ai.meta.com does not publish an RSS feed; Google News indexes the blog.',
  },
  {
    name: 'OpenAI',
    url: 'https://news.google.com/rss/search?q=site:openai.com&hl=en-US&gl=US&ceid=US:en',
    via: 'google-news',
    note: 'OpenAI removed their RSS feed; Google News indexes openai.com.',
  },
];

// Stocks Hector wants to track on the research dashboard. Edit freely.
export const WATCHLIST = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META', 'TSLA', 'COIN', 'MSTR'];

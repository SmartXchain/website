export type ResearchKind = 'paper' | 'news' | 'stock';

export interface ResearchItem {
  kind: ResearchKind;
  source: string;
  title: string;
  url: string;
  summary?: string;
  publishedAt?: Date;
  authors?: string[];
}

export interface StockQuote {
  symbol: string;
  source: 'alphavantage' | 'finnhub';
  price: number;
  change?: number;
  changePercent?: number;
  asOf: Date;
}

export interface SourceResult<T = ResearchItem> {
  source: string;
  ok: boolean;
  items: T[];
  error?: string;
}

import type { SourceResult, StockQuote } from './types';

interface Env {
  ALPHA_VANTAGE_KEY?: string;
  FINNHUB_KEY?: string;
}

async function alphaVantageQuote(symbol: string, key: string): Promise<StockQuote | null> {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json: any = await res.json();
  const q = json?.['Global Quote'];
  if (!q || !q['05. price']) return null;
  const price = parseFloat(q['05. price']);
  const change = parseFloat(q['09. change']);
  const changePercent = parseFloat(String(q['10. change percent'] ?? '').replace('%', ''));
  return {
    symbol,
    source: 'alphavantage',
    price,
    change: isNaN(change) ? undefined : change,
    changePercent: isNaN(changePercent) ? undefined : changePercent,
    asOf: new Date(),
  };
}

async function finnhubQuote(symbol: string, key: string): Promise<StockQuote | null> {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json: any = await res.json();
  if (typeof json?.c !== 'number' || json.c === 0) return null;
  return {
    symbol,
    source: 'finnhub',
    price: json.c,
    change: typeof json.d === 'number' ? json.d : undefined,
    changePercent: typeof json.dp === 'number' ? json.dp : undefined,
    asOf: new Date(json.t ? json.t * 1000 : Date.now()),
  };
}

export async function fetchStockQuotes(
  symbols: string[],
  env: Env,
): Promise<SourceResult<StockQuote>> {
  const errors: string[] = [];
  const items: StockQuote[] = [];

  for (const symbol of symbols) {
    let quote: StockQuote | null = null;

    // Prefer Finnhub (real-time, generous rate limit). Fall back to Alpha Vantage.
    if (env.FINNHUB_KEY) {
      try {
        quote = await finnhubQuote(symbol, env.FINNHUB_KEY);
      } catch (e) {
        errors.push(`${symbol} finnhub: ${e instanceof Error ? e.message : e}`);
      }
    }
    if (!quote && env.ALPHA_VANTAGE_KEY) {
      try {
        quote = await alphaVantageQuote(symbol, env.ALPHA_VANTAGE_KEY);
      } catch (e) {
        errors.push(`${symbol} alphavantage: ${e instanceof Error ? e.message : e}`);
      }
    }
    if (quote) items.push(quote);
  }

  const ok = items.length > 0 || (!env.FINNHUB_KEY && !env.ALPHA_VANTAGE_KEY);
  return {
    source: 'stocks',
    ok,
    items,
    error: errors.length ? errors.join('; ') : undefined,
  };
}

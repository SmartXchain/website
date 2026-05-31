import { XMLParser } from 'fast-xml-parser';
import type { ResearchItem, SourceResult } from './types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
});

const CATEGORIES = ['cs.AI', 'cs.LG', 'cs.CL'] as const;

function clean(s: string, max = 320): string {
  const c = s.replace(/\s+/g, ' ').trim();
  return c.length <= max ? c : c.slice(0, max).trimEnd() + '…';
}

function arr<T>(v: T | T[] | undefined): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function pickAbsLink(entry: any): string {
  for (const l of arr(entry.link)) {
    if (l?.['@_rel'] === 'alternate' && l?.['@_href']) return l['@_href'];
  }
  return entry.id ?? '';
}

export async function fetchArxiv(limit = 10): Promise<SourceResult> {
  const query = CATEGORIES.map((c) => `cat:${c}`).join('+OR+');
  const url = `https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=${limit}&sortBy=submittedDate&sortOrder=descending`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SmartXChain-Research/1.0' },
    });
    if (!res.ok) {
      return { source: 'arXiv', ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const xml = await res.text();
    const parsed = parser.parse(xml);
    const entries = arr(parsed?.feed?.entry);

    const items: ResearchItem[] = entries.map((e: any) => {
      const authors = arr(e.author).map((a: any) => String(a?.name ?? '')).filter(Boolean);
      return {
        kind: 'paper' as const,
        source: 'arXiv',
        title: clean(String(e.title ?? ''), 200),
        url: pickAbsLink(e),
        summary: clean(String(e.summary ?? '')),
        publishedAt: e.published ? new Date(String(e.published)) : undefined,
        authors,
      };
    });

    return { source: 'arXiv', ok: true, items };
  } catch (err) {
    return {
      source: 'arXiv',
      ok: false,
      items: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

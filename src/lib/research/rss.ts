import { XMLParser } from 'fast-xml-parser';
import type { ResearchItem, SourceResult } from './types';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
});

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function clamp(s: string, max = 280): string {
  if (s.length <= max) return s;
  return s.slice(0, max).trimEnd() + '…';
}

function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
}

function arr<T>(v: T | T[] | undefined): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function pickLink(item: any): string {
  if (typeof item.link === 'string') return item.link;
  const links = arr(item.link);
  for (const l of links) {
    if (typeof l === 'string') return l;
    if (l?.['@_href']) return l['@_href'];
  }
  return '';
}

export async function fetchRssFeed(
  source: string,
  url: string,
  limit = 8,
): Promise<SourceResult> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SmartXChain-Research/1.0' },
    });
    if (!res.ok) {
      return { source, ok: false, items: [], error: `HTTP ${res.status}` };
    }
    const xml = await res.text();
    const parsed = parser.parse(xml);

    // RSS 2.0
    const rssItems = parsed?.rss?.channel?.item;
    if (rssItems) {
      const items: ResearchItem[] = arr(rssItems)
        .slice(0, limit)
        .map((it: any) => ({
          kind: 'news' as const,
          source,
          title: stripHtml(String(it.title ?? '')),
          url: pickLink(it),
          summary: clamp(stripHtml(String(it.description ?? ''))),
          publishedAt: parseDate(it.pubDate ?? it['dc:date']),
        }));
      return { source, ok: true, items };
    }

    // Atom 1.0
    const atomEntries = parsed?.feed?.entry;
    if (atomEntries) {
      const items: ResearchItem[] = arr(atomEntries)
        .slice(0, limit)
        .map((it: any) => ({
          kind: 'news' as const,
          source,
          title: stripHtml(String(it.title?.['#text'] ?? it.title ?? '')),
          url: pickLink(it),
          summary: clamp(stripHtml(String(it.summary?.['#text'] ?? it.summary ?? it.content?.['#text'] ?? it.content ?? ''))),
          publishedAt: parseDate(it.published ?? it.updated),
        }));
      return { source, ok: true, items };
    }

    return { source, ok: false, items: [], error: 'Unknown feed format' };
  } catch (err) {
    return {
      source,
      ok: false,
      items: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

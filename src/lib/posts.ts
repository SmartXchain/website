import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

const WORDS_PER_MINUTE = 230;

export function readTime(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!?\[.*?\]\(.*?\)/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function sortByDateDesc<T extends { data: { date: Date } }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatStamp(date: Date): string {
  const iso = date.toISOString();
  return `${iso.slice(2, 4)}.${iso.slice(5, 7)}.${iso.slice(8, 10)} · ${iso.slice(11, 16)} UTC`;
}

export function formatShortDate(date: Date): string {
  const iso = date.toISOString();
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
}

export function timeSince(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.valueOf() - date.valueOf()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatShortDate(date);
}

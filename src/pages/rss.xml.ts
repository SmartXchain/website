import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../lib/site';
import { sortByDateDesc } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = sortByDateDesc(
    await getCollection('posts', ({ data }) => !data.draft),
  );

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.excerpt,
      link: `/posts/${p.slug}`,
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: `<language>en-us</language>`,
  });
}

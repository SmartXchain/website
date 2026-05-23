import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../../lib/site';
import { sections, getSection, type SectionSlug } from '../../lib/sections';
import { sortByDateDesc } from '../../lib/posts';

export async function getStaticPaths() {
  return sections.map((s) => ({ params: { category: s.slug } }));
}

export async function GET(context: APIContext) {
  const category = context.params.category as SectionSlug;
  const section = getSection(category);

  const posts = sortByDateDesc(
    await getCollection(
      'posts',
      ({ data }) => !data.draft && data.category === category,
    ),
  );

  return rss({
    title: `${SITE.name} — ${section.name}`,
    description: section.blurb,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.excerpt,
      link: `/posts/${p.slug}`,
      categories: p.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}

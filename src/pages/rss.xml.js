import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// RSS feed at /rss.xml (Build_03 §3.8). @astrojs/rss is a helper library, not an
// auto-emitting integration — this endpoint is authored manually. Empty channel
// (0 items) is valid until the first article publishes (Phase 5 Workflow 1).
export async function GET(context) {
  const articles = (await getCollection('blog')).sort(
    (a, b) => b.data.publish_date.getTime() - a.data.publish_date.getTime(),
  );

  return rss({
    title: 'buyholdwrite — banker-written guides on 401K, IRA, and NRA investing',
    description:
      'Plain-English articles from Sunny Sun, a banker writing about 401K rollovers, self-directed IRAs, and US investing for non-residents. New articles weekly.',
    site: context.site,
    items: articles.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publish_date,
      description: post.data.description,
      link: `/blog/${post.data.slug}/`,
    })),
  });
}

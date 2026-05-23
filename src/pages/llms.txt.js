import { getCollection } from 'astro:content';

// llms.txt at /llms.txt for AI-crawler discovery (Build_03 §3.4). Authored as a
// generated endpoint, NOT a static public/ file — the spec's "auto-updated on every
// build with article list" requires reading the content collection at build time
// (a public/ file is copied verbatim and can't enumerate articles). Same pattern as
// rss.xml.js. The ## Articles section is omitted until the first article publishes.
export async function GET(context) {
  const site = (context.site?.toString() ?? 'https://buyholdwrite.com/').replace(/\/$/, '');

  const articles = (await getCollection('blog')).sort(
    (a, b) => b.data.publish_date.getTime() - a.data.publish_date.getTime(),
  );

  const pages = [
    ['About', '/about/', "9 years in a top US bank — Sunny Sun's background and credentials behind buyholdwrite."],
    ['The STACK methodology', '/stack/', 'STACK: a covered-call framework on QQQ — sell theta, accumulate, compound, keep.'],
    ['Blog', '/blog/', 'Educational articles on 401K rollovers, self-directed IRAs, and US investing for non-residents.'],
    ['Newsletter', '/newsletter/', 'The weekly Friday email: a trade walk-through, market read, and one banker insight.'],
  ];

  const sections = [
    '# buyholdwrite.com',
    '> Plain-English articles from Sunny Sun, a banker writing about 401K rollovers, self-directed IRAs, and US investing for non-residents. New articles weekly.',
    ['## Pages', ...pages.map(([t, p, d]) => `- [${t}](${site}${p}): ${d}`)].join('\n'),
  ];

  if (articles.length > 0) {
    sections.push(
      ['## Articles', ...articles.map((a) => `- [${a.data.title}](${site}/blog/${a.data.slug}/): ${a.data.description}`)].join('\n'),
    );
  }

  sections.push(['## Notes', '- Educational only — not financial advice.'].join('\n'));

  return new Response(sections.join('\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

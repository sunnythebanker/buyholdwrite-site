import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Build-time OG image generation (Build_03 §3.7). Static endpoint → one
// /og/{slug}.png per article, matching the URL hardcoded in blog/[slug].astro:52.
// Articles only per spec (Decision Q8); the 7 static pages keep text-only social
// previews until the creative-assets batch ships hand-designed static OGs.
export const prerender = true;

// Fonts resolved from public/fonts (Build_03 §3.7). process.cwd() is the Astro
// project root during `astro build` — more reliable than import.meta.url under
// Vite SSR bundling. Read once at module load, reused across every render.
const FONT_DIR = join(process.cwd(), 'public', 'fonts');
const serifBold = readFileSync(join(FONT_DIR, 'SourceSerif4-Bold.ttf'));
const sansRegular = readFileSync(join(FONT_DIR, 'SourceSans3-Regular.ttf'));

// Subtitle category labels — mirrors blog/[slug].astro:25-29 (Decision I inline
// pattern; 2nd of an eventual rule-of-three → extract to src/data on the 3rd use).
const CATEGORY_LABELS: Record<string, string> = {
  '401k-rollover': '401K Rollover',
  'self-directed-ira': 'Self-Directed IRA',
  'nra-investing': 'NRA Investing',
};

// Brand tokens (locked).
const NAVY = '#1B2A4A';
const GOLD = '#C5A55A';
const WARM_WHITE = '#FAFAF8';

// Hard guard: cap title length before satori so it can never exceed ~3 lines,
// independent of whether satori honours -webkit-line-clamp (belt). Frontmatter
// schema already caps titles at 80 chars (Build_05 §3), so 120 only ever trips
// for a malformed fixture — pure defensive ceiling.
const MAX_TITLE_CHARS = 120;

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('blog');
  return articles.map((article) => ({
    params: { slug: article.data.slug },
    props: { title: article.data.title, category: article.data.category },
  }));
};

// STACK pyramid badge (top-left). Reproduces public/logos/stack-icon-dark.svg's
// exact bar geometry (scaled from its 120px viewBox) and opacities — gold top
// bar, white bars fading 0.9/0.6/0.35/0.18 — but WITHOUT that asset's #0F1729
// background box, so it sits on the navy card with no off-brand colour (Q5).
// Rebuilt as flex divs (not an embedded <img>) for deterministic rendering.
const badgeBar = (width: number, height: number, color: string, opacity: number) => ({
  type: 'div',
  props: { style: { width, height, borderRadius: height / 2, backgroundColor: color, opacity } },
});

const badge = {
  type: 'div',
  props: {
    // alignSelf flex-start shrinks the badge to its content width and pins it to
    // the top-left corner (Q7); alignItems center keeps the pyramid symmetric.
    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'flex-start', gap: 5 },
    children: [
      badgeBar(29, 7, GOLD, 1),
      badgeBar(46, 8, '#FFFFFF', 0.9),
      badgeBar(64, 9, '#FFFFFF', 0.6),
      badgeBar(81, 11, '#FFFFFF', 0.35),
      badgeBar(96, 12, '#FFFFFF', 0.18),
    ],
  },
};

// 1200×630 card (Q1): navy bg, badge pinned top-left, text block bottom.
const card = (title: string, subtitle: string) => ({
  type: 'div',
  props: {
    style: {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 80,
      backgroundColor: NAVY,
      fontFamily: 'Source Sans 3',
    },
    children: [
      badge,
      {
        type: 'div',
        props: {
          style: { display: 'flex', flexDirection: 'column' },
          children: [
            // Gold eyebrow accent line above the title (Q6).
            {
              type: 'div',
              props: { style: { width: 140, height: 6, borderRadius: 3, backgroundColor: GOLD, marginBottom: 28 } },
            },
            // Title — Source Serif 4 Bold 64px, clamp to 3 lines (Q4).
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Source Serif 4',
                  fontWeight: 700,
                  fontSize: 64,
                  lineHeight: 1.15,
                  color: WARM_WHITE,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  overflow: 'hidden',
                },
                children: title,
              },
            },
            // Subtitle — "{Category} · buyholdwrite.com" (Q3).
            {
              type: 'div',
              props: {
                style: { fontFamily: 'Source Sans 3', fontWeight: 400, fontSize: 30, color: GOLD, marginTop: 24 },
                children: subtitle,
              },
            },
          ],
        },
      },
    ],
  },
});

export const GET: APIRoute = async ({ props }) => {
  const { title, category } = props as { title: string; category: string };
  const safeTitle =
    title.length > MAX_TITLE_CHARS ? title.slice(0, MAX_TITLE_CHARS - 1).trimEnd() + '…' : title;
  const subtitle = `${CATEGORY_LABELS[category] ?? category} · buyholdwrite.com`;

  // satori takes a plain element tree (no JSX/React) → cast for TS; astro build
  // transpiles without type-checking, so this is type-only.
  const svg = await satori(card(safeTitle, subtitle) as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Source Serif 4', data: serifBold, weight: 700, style: 'normal' },
      { name: 'Source Sans 3', data: sansRegular, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};

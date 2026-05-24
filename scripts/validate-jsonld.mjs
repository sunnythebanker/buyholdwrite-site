#!/usr/bin/env node
// JSON-LD schema validator (Build_03 §3.15, Tier C item 17, Path A).
//
// Validates every <script type="application/ld+json"> block in the built site
// (./dist/**/*.html) against three layers:
//   Layer 1 (error): JSON well-formedness (JSON.parse).
//   Layer 2 (error): structural — block-root @context is schema.org; every typed
//                    node's @type is in the known set.
//   Layer 3 (error): Google rich-result required fields per @type.
//
// Default is STRICT — any failure exits non-zero. Override a specific missing
// field via --allow-missing=Type:field (comma-separated for multiple), e.g.
//   --allow-missing=Article:datePublished,Person:name
// with justification in the commit message. Zero runtime dependencies (Node 22+).
//
// Usage: node scripts/validate-jsonld.mjs [distDir=./dist] [--allow-missing=...]
// Wired into validate.yml in the items 15+16+17+18 atomic session.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const KNOWN_TYPES = new Set([
  'Article', 'Person', 'Organization', 'WebSite', 'BreadcrumbList',
  'ImageObject', 'ListItem', 'WebPage',
  // Phase 5 (§3.3): add 'FAQPage', 'HowTo' when those parsers land.
]);

// Google rich-result required fields per type. A field counts as present when
// the key exists and the value is non-empty (non-null, non-'', non-empty-array).
const REQUIRED_FIELDS = {
  Article: ['headline', 'image', 'datePublished', 'author', 'publisher'],
  BreadcrumbList: ['itemListElement'],
  Person: ['name'],
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  ImageObject: ['url'],
  ListItem: ['position', 'name', 'item'],
};

// ---- CLI args ----
const args = process.argv.slice(2);
const distDir = args.find((a) => !a.startsWith('--')) ?? './dist';
const allowMissing = new Set(
  args
    .filter((a) => a.startsWith('--allow-missing='))
    .flatMap((a) => a.slice('--allow-missing='.length).split(','))
    .map((s) => s.trim())
    .filter(Boolean),
);

// ---- helpers ----
const isPresent = (v) =>
  v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);

function extractJsonLdBlocks(html) {
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1].trim());
  return blocks;
}

// Recursively collect every object carrying an @type (top-level + nested).
function collectTypedNodes(node, acc = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectTypedNodes(item, acc);
  } else if (node && typeof node === 'object') {
    if (typeof node['@type'] === 'string') acc.push(node);
    for (const key of Object.keys(node)) {
      if (key === '@type' || key === '@context') continue;
      collectTypedNodes(node[key], acc);
    }
  }
  return acc;
}

function validateBlock(jsonText, file, idx) {
  const errors = [];
  const loc = `${file} [block ${idx}]`;

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (e) {
    errors.push(`${loc}: Layer 1 — invalid JSON (${e.message})`);
    return errors; // can't go further on unparseable JSON
  }

  // Handle three JSON-LD wrapping patterns: single object (our current case),
  // array, and @graph wrapper. @context can live at block root OR in @graph
  // children; resolve the holder explicitly.
  const topNodes = Array.isArray(data) ? data : data['@graph'] ? data['@graph'] : [data];
  const contextHolder = data && data['@context'] !== undefined ? data : topNodes[0] ?? {};
  if (contextHolder['@context'] !== 'https://schema.org') {
    errors.push(
      `${loc}: Layer 2 — @context must be "https://schema.org" (got ${JSON.stringify(contextHolder['@context'])})`,
    );
  }

  // Layer 2 + 3 over every typed node.
  for (const n of collectTypedNodes(data)) {
    const type = n['@type'];
    if (!KNOWN_TYPES.has(type)) {
      errors.push(`${loc}: Layer 2 — unknown @type "${type}" (extend KNOWN_TYPES if intended)`);
      continue;
    }
    for (const field of REQUIRED_FIELDS[type] ?? []) {
      if (!isPresent(n[field])) {
        if (allowMissing.has(`${type}:${field}`)) continue; // explicit, documented override
        // TODO: if multi-instance disambiguation needed (e.g., multiple Person
        // nodes in one Article), add a node-path traversal hint to the error.
        // Single-Person-per-Article is current reality.
        errors.push(`${loc}: Layer 3 — ${type} missing required field "${field}"`);
      }
    }
  }
  return errors;
}

// ---- main ----
let htmlFiles;
try {
  htmlFiles = readdirSync(distDir, { recursive: true })
    .filter((p) => typeof p === 'string' && p.endsWith('.html'))
    .map((p) => join(distDir, p))
    .sort();
} catch (e) {
  console.error(`Cannot read dist dir "${distDir}": ${e.message}`);
  process.exit(2);
}

let totalBlocks = 0;
const allErrors = [];
for (const file of htmlFiles) {
  const blocks = extractJsonLdBlocks(readFileSync(file, 'utf-8'));
  blocks.forEach((b, i) => {
    totalBlocks++;
    allErrors.push(...validateBlock(b, file, i));
  });
}

console.log(
  `Validated ${totalBlocks} JSON-LD block(s) across ${htmlFiles.length} HTML file(s) in ${distDir}.`,
);
if (allowMissing.size) console.log(`Allowed-missing overrides: ${[...allowMissing].join(', ')}`);

if (allErrors.length) {
  console.error(`\n✘ ${allErrors.length} error(s):`);
  for (const e of allErrors) console.error(`  ${e}`);
  process.exit(1);
}
console.log('✓ All JSON-LD blocks valid.');

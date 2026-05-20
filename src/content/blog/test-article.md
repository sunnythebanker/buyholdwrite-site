---
title: "Test article — frontmatter schema validation placeholder"
description: "Mock article body used to exercise the Zod content collection schema and visually verify the article template renders all in-article components correctly. Educational placeholder."
slug: "test-article"
publish_date: 2026-05-19
last_updated: 2026-05-19
category: "401k-rollover"
tags: ["test", "mock", "schema-validation"]
author: "Sunny Sun"
schema_type: "Article"
---

<div style="background:rgba(155,34,38,.07);border-left:4px solid #9B2226;padding:1rem 1.25rem;border-radius:0 4px 4px 0;margin-bottom:1.5rem;font-family:Arial,sans-serif;font-size:14px;color:#9B2226;font-weight:700;letter-spacing:.04em;">
  [MOCK ARTICLE — DO NOT SHIP] This file is a frontmatter-schema and article-template visual test. Delete before merging Tier B item 9 to main.
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This opening paragraph is rendered with the `.lead` treatment if the first block is a paragraph — testing the article-body lead typography (21px Navy).

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## First H2 — Section heading lorem ipsum

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. For more context, see the [About page](/about) (internal link demo).

<div class="pullquote">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, demonstrating the gold-left-border + Georgia italic 22px treatment at typical pull-quote length.
  <cite>— Mock attribution placeholder</cite>
</div>

### H3 subsection heading placeholder

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur:

- **Lorem ipsum:** dolor sit amet consectetur adipiscing elit
- **Sed do eiusmod:** tempor incididunt ut labore et dolore magna
- **Ut enim ad minim:** veniam quis nostrud exercitation ullamco
- **Duis aute irure:** dolor in reprehenderit voluptate velit esse

<figure class="fig">
  <div class="img-placeholder" style="background:#1B2A4A;color:#E8E5DC;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:12px;letter-spacing:.04em;">[figure placeholder · 16:9]</div>
  <figcaption>Mock caption — exercises italic gray centered figcaption treatment.</figcaption>
</figure>

External reference example: [Schema.org Article spec](https://schema.org/Article) — exercises the navy + small ↗ arrow icon external-link style.

<div class="callout">
  <div class="label">CALLOUT EXAMPLE</div>
  <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
  <p>Nam libero tempore cum soluta nobis est eligendi optio. Cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
</div>

## Second H2 — Code block and table

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti. The code block below exercises the charcoal-background + monospace styling:

```python
# example.py — generic placeholder
def hello(name="world"):
    return f"hello, {name}"

# >>> hello()
# 'hello, world'
print(hello())
```

Et harum quidem rerum facilis est et expedita distinctio. The table below exercises navy header row + alternating row backgrounds + Arial 14px:

| Year | Milestone                          |
| ---- | ---------------------------------- |
| 2017 | Started inside a top US bank       |
| 2021 | Family flower business full-time   |
| 2026 | Launched buyholdwrite.com (mocked) |

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.

### H3 closing subsection

Closing paragraph lorem ipsum. Numbered list demonstration:

1. Lorem ipsum dolor sit amet consectetur adipiscing elit
2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
3. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris
4. Duis aute irure dolor in reprehenderit voluptate velit esse cillum

## FAQ — frequently asked questions

<details>
  <summary>What is this article testing?</summary>
  <p>This article is a Phase 3 frontmatter-schema validation fixture and an article-template CSS visual verification fixture. It is not real content and is deleted before merging to main.</p>
</details>

<details>
  <summary>Does the FAQ accordion need JavaScript?</summary>
  <p>No. It uses the native HTML5 <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> elements, which give us toggle behavior, keyboard accessibility, and screen-reader semantics for free.</p>
</details>

End of mock article body.

# Blog Feature Design

## Context

Ultra Agentic is a static Astro site with a Markdown content collection for catalog entries. There is no `/blog` route, no blog collection, and no Blog item in site navigation. The site already has validated content collections, SEO helpers, Layout/header/footer patterns, and a Bun + Playwright verification suite.

## Goal

Add a public English-language blog at `/blog` that mixes educational guides about agent infrastructure (MCP, skills, datasets, maturity) with build-in-public / roadmap posts. Ship six seed posts, wire Blog into primary navigation, and keep the implementation aligned with existing catalog content patterns.

## Decisions

| Decision | Choice |
| --- | --- |
| Content focus | Mix of education + build-in-public |
| Seed count | 6 posts |
| Language | English only |
| Navigation | Primary nav item “Blog” → `/blog/` |
| Content system | Astro Content Collection (parallel to catalog) |
| Interactivity on index | None (no JS filters for seed scale) |

## Architecture

### Content collection

- Path: `web/src/content/blog/*.md`
- Register a `blog` collection in `web/src/content.config.ts` with Zod schema:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Required |
| `description` | string | Meta description and card summary |
| `pubDate` | date | Primary sort key |
| `updatedDate` | date | Optional |
| `author` | string | Default `"Ultra Agentic"` in content or schema default |
| `category` | `"guide"` \| `"roadmap"` | Education vs build-in-public |
| `tags` | string[] | At least one tag |
| `draft` | boolean | Optional; default `false`. Drafts are excluded from index and static paths |

### Routes

- `/blog/` — index listing published posts newest-first
- `/blog/[slug]/` — post detail; slug equals content id from the Markdown filename

### Helpers and UI

- `web/src/lib/blog.ts` — category labels, publish filter (`draft !== true`), sort by `pubDate` descending
- `web/src/components/BlogCard.astro` — list card: title link, date, category badge, description
- Reuse `Layout`, `SiteHeader`, `SiteFooter`, `SponsorCTA`
- Detail pages use `ogType: 'article'` and BlogPosting JSON-LD via an SEO helper (same spirit as catalog TechArticle helpers)

### Navigation

Add `{ label: 'Blog', href: '/blog/' }` to `siteConfig.navigation` so header and footer both expose it.

## Seed posts

Four guides and two roadmap posts. Index order follows `pubDate` (newest first). Seed dates are staggered over recent weeks so the timeline feels natural.

| Slug | Category | Focus |
| --- | --- | --- |
| `what-is-an-mcp-server` | guide | MCP as a bounded connection layer; not a skill or dataset |
| `skills-vs-mcp-vs-datasets` | guide | When to use each catalog layer |
| `how-to-read-maturity-labels` | guide | Planned / beta / stable evaluation guidance |
| `composing-agent-workflows` | guide | Compose connect → procedure → evidence |
| `ultra-agentic-roadmap-kickoff` | roadmap | Why catalog-first; early-stage honesty |
| `building-in-public-catalog-honesty` | roadmap | Build-in-public without overclaiming artifacts |

Tone matches existing catalog policy: planned means specified, not shipped; no false release claims.

## Page UX

### Index (`/blog/`)

- Page hero with utility label, H1, and one short supporting sentence
- List of `BlogCard` entries (no search/filter UI for v1)
- Optional sponsor CTA below the list (consistent with other content pages)

### Detail (`/blog/[slug]/`)

- Back link to `/blog/`
- Title, meta bar (date, category, author), markdown body prose
- Sponsor CTA below the article

Visual language follows existing site tokens and section patterns; no new design system.

## Error handling and edge cases

- Entries with `draft: true` are omitted from `getStaticPaths` and the index
- Unknown slug resolves to the existing Astro 404 page
- Empty markdown body is allowed if frontmatter validates

## Non-goals

- RSS/Atom feeds
- Tag or category archive pages
- Client-side search/filters
- MDX or interactive embeds
- Comments, CMS, or author accounts
- Configuring `siteUrl`, sitemap, or `robots.txt` (still a separate production concern)

## Testing and verification

- Unit tests for blog helpers (sort, draft filtering, category labels)
- Unit tests for BlogPosting structured-data helper
- Dist / e2e coverage: `/blog/` returns 200, lists six posts, one detail slug works, nav includes Blog
- Update any fixed path expectations in the verification suite
- Run `bun run verify` from `web/` before considering the feature complete

## Success criteria

- `/blog/` and `/blog/<slug>/` render for all six published posts
- Blog appears in primary navigation
- Content collection validates frontmatter
- Verification suite passes
- Copy never claims catalog artifacts are released when they are planned

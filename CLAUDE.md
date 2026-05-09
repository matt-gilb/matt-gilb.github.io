# CLAUDE.md — mattgilbert.co

Context for working on this project. Covers non-obvious decisions, gotchas, and constraints that aren't apparent from reading the code.

---

## Critical: Astro version

This project is pinned to **Astro 5** (`astro@^5.18.1`). Do not upgrade to Astro 6 — the Content Collections API changed in ways that would break the site.

Astro 5-specific APIs in use:
- `import { render } from 'astro:content'` → `const { Content } = await render(entry)` (NOT `entry.render()`)
- `entry.slug` works because both collections use `type: 'content'` (legacy mode) in `src/content/config.ts`

---

## Local development

Node is managed with **fnm**. Before running any npm command in a new terminal, activate it:

```sh
eval "$(/opt/homebrew/bin/fnm env --shell bash)"
```

Then: `npm install` / `npm run dev` as normal.

---

## Build and search

- `npm run build` — builds the site to `dist/`, but search will not work
- `npm run build:search` — builds then runs Pagefind (`npx pagefind --site dist`); required to test search locally
- Search is **not available in dev mode** — the Pagefind UI shows a graceful fallback message instead

## Deployment

Push to `main` → GitHub Actions builds, runs Pagefind, deploys to GitHub Pages. Workflow at `.github/workflows/deploy.yml`. Live at `mattgilbert.co` (CNAME in `public/`).

---

## Content collections

Two collections defined in `src/content/config.ts`:

- **`posts`** — 24 blog posts in `src/content/posts/`; URL pattern `/blog/[slug]/`
- **`projects`** — 6 build journal posts in `src/content/projects/`; URL pattern `/portfolio/[slug]/`

Projects have an extra `status` field (`'active' | 'completed' | 'archived'`).

### Blog pagination

Page 1 is at `/blog/` (`src/pages/blog/index.astro`). Pages 2+ are at `/blog/page/[n]/` (`src/pages/blog/page/[page].astro`). This avoids a route conflict with `/blog/[slug]/`. The `Pagination` component handles the edge case where page 2's "previous" link goes to `/blog/` not `/blog/page/1/`.

### Tag normalization

Tags are normalized with `tag.toLowerCase().replace(/\s+/g, '-')` everywhere they're used as URL slugs. This must be consistent across `PostCard.astro`, `TagList.astro`, `tags/index.astro`, and `tags/[tag].astro`.

### `PAGE_SIZE` scoping

`PAGE_SIZE` must be declared **inside** `getStaticPaths()` in `src/pages/blog/page/[page].astro` — Astro runs `getStaticPaths` in isolation and the outer scope is not accessible.

---

## Design system

**Colors:** Atom One Dark (default) / Atom One Light, applied via CSS custom properties on `[data-theme]` attribute on `<html>`.

**Theme toggle:** An inline IIFE in `<head>` (in `Base.astro`) sets `data-theme` before CSS loads to prevent FOUC. Priority: `localStorage('theme')` → `prefers-color-scheme` → `'dark'`.

**Syntax highlighting:** Shiki with `defaultColor: false` in `astro.config.mjs`. CSS variables `--shiki-dark` / `--shiki-light` control which palette renders. `src/styles/syntax.css` swaps them based on `[data-theme]`.

---

## External links

`rehype-external-links` is configured in `astro.config.mjs` to automatically add `target="_blank" rel="noopener noreferrer"` to all external links in markdown. No need for `{:target="_blank"}` Jekyll syntax (that was stripped during migration).

---

## Galleries and video

Trip report posts contain raw HTML `<div class="gallery-box"><div class="gallery">` blocks with `<img>` tags. CSS in `global.css` renders them as a grid. A vanilla JS lightbox in `Post.astro` handles click-to-enlarge.

YouTube iframes have hardcoded `width`/`height` attributes from the YouTube embed code — these are overridden by `.prose iframe { width: 100%; aspect-ratio: 16/9; height: auto; }` in `global.css`.

---

## Third-party integrations

- **Mailchimp** endpoint is in `src/components/Footer.astro`
- **Formspree** form ID `xzbwdyro` is in `src/pages/contact.astro` (action: `https://formspree.io/f/xzbwdyro`)
- **RSS** feed generated at `/feed.xml` by `src/pages/feed.xml.ts` — posts only, sorted date desc

---

## Content copyright

All posts, images, and media are copyright © Matt Gilbert and are not licensed for reuse outside of building this personal website.

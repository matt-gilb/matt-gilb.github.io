# CLAUDE.md — mattgilbert.co

Context for working on this project. Covers non-obvious decisions, gotchas, and constraints that aren't apparent from reading the code.

---

## Changing URLs / route paths

URL changes are fine — just confirm with Matt first (a one-line "rename `/foo/` to `/bar/`?" is enough). When renaming a route, update all of: the directory under `src/pages/`, every `href`/path string in `.astro` and `.ts` files, and any references in this file. Search the full `src/` tree before claiming the rename is done. No redirects are configured, so old URLs will 404 after the change.

---

## Astro version

This project runs on **Astro 6** (`astro@^6.3.2`). Content collections use the **Content Layer API** via the `glob()` loader from `astro/loaders`, defined in `src/content.config.ts` (note: not `src/content/config.ts` — Astro 6 expects the file at the new location).

Astro 6-specific APIs in use:
- `loader: glob({ pattern: '**/*.md', base: './src/content/<collection>' })` defines each collection.
- `import { render } from 'astro:content'` → `const { Content } = await render(entry)` (NOT `entry.render()`).
- `entry.id` is the URL slug (filename without `.md`). The legacy `entry.slug` property no longer exists.

Node ≥ 22.12.0 is required. The project pins `24.15.0` in `.node-version`.

---

## Local development

Node is managed with **fnm** (shell integration is active, no manual activation needed). Just run `npm install` / `npm run dev` as normal.

---

## Build and search

- `npm run build` — builds the site to `dist/`, but search will not work
- `npm run build:search` — builds then runs Pagefind (`npx pagefind --site dist`); required to test search locally
- Search is **not available in dev mode** — the Pagefind UI shows a graceful fallback message instead

## Deployment

Push to `main` → GitHub Actions builds, runs Pagefind, deploys to GitHub Pages. Workflow at `.github/workflows/deploy.yml`. Live at `mattgilbert.co` (CNAME in `public/`).

---

## Content collections

Two collections defined in `src/content.config.ts` (both use `loader: glob(...)` from `astro/loaders`):

- **`posts`** — 24 blog posts in `src/content/posts/`; URL pattern `/blog/[slug]/`
- **`projects`** — 6 build journal posts in `src/content/projects/`; URL pattern `/projects/[slug]/`

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

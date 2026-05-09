# Personal Blog — Astro + GitHub Actions Design Spec

**Date:** 2026-05-08
**Status:** Approved

---

## Overview

Replace the existing Jekyll site at `matt-gilb.github.io` (served at `mattgilbert.co`) with a new Astro-based static site. The new site migrates all existing posts and images, adds a separate projects/portfolio content type, and introduces search, a newsletter signup, and a dark/light theme toggle. Built locally and deployed via GitHub Actions to the same GitHub Pages repository.

---

## Stack

| Layer | Choice |
|---|---|
| Static site generator | Astro (Content Collections) |
| Deployment | GitHub Actions → `gh-pages` branch |
| Search | Pagefind (post-build, fully static) |
| Newsletter | Mailchimp (existing account) |
| Contact form | Formspree (existing account, ID: `xzbwdyro`) |
| RSS | `@astrojs/rss` → `/feed.xml` |
| Sitemap | `@astrojs/sitemap` |
| Syntax highlighting | Shiki (`one-dark-pro` / `github-light`) |

---

## Repository

- **Repo:** `matt-gilb/matt-gilb.github.io` (existing repo, content replaced)
- **Source branch:** `main` (Astro project)
- **Deploy branch:** `gh-pages` (built output, managed by Actions)
- **Custom domain:** `mattgilbert.co` — `CNAME` file in `public/` so Astro copies it to `dist/`

---

## Project Structure

```
my_site_2026/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── images/               # Copied as-is from old site
│   ├── CNAME                 # Contains: mattgilbert.co
│   └── favicon.*             # Copied from old site
├── src/
│   ├── content/
│   │   ├── config.ts         # Collection schemas
│   │   ├── posts/            # 24 regular posts (.md)
│   │   └── projects/         # 6 build journal posts (.md)
│   ├── layouts/
│   │   ├── Base.astro        # html, head, theme script, header, footer
│   │   ├── Post.astro        # Blog post: meta + prev/next nav
│   │   └── Page.astro        # Generic static page
│   ├── components/
│   │   ├── Header.astro      # Nav + theme toggle
│   │   ├── Footer.astro      # Social links + Mailchimp signup
│   │   ├── PostCard.astro    # Reusable card (posts + projects)
│   │   ├── TagList.astro     # Tag pills with links
│   │   ├── ThemeToggle.astro # Button + inline anti-FOUC script
│   │   └── Pagination.astro  # Prev/next page links
│   ├── pages/
│   │   ├── index.astro       # Home: hero + 6 recent posts
│   │   ├── blog/
│   │   │   ├── index.astro   # Paginated post list (8/page)
│   │   │   └── [...slug].astro
│   │   ├── portfolio/
│   │   │   ├── index.astro   # Project grid
│   │   │   └── [...slug].astro
│   │   ├── tags/
│   │   │   ├── index.astro   # All tags with counts
│   │   │   └── [tag].astro   # Posts + projects by tag
│   │   ├── about.astro
│   │   └── contact.astro
│   └── styles/
│       ├── global.css        # CSS custom properties, reset, base styles
│       └── syntax.css        # Shiki theme overrides
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Content Collections

### `posts` collection
24 regular posts migrated from `_posts/` (all except the 6 build journal posts).

**Schema:**
```ts
title: string
description: string
date: Date
image: string          // e.g. /images/posts/foo/hero.jpg
tags: string[]
draft?: boolean        // optional, defaults false
```

**URL pattern:** `/blog/[slug]/`

**Migration note:** Remove `layout: post` from frontmatter — Astro handles layout via `Post.astro`.

### `projects` collection
6 build journal posts moved from `_posts/`:
- `2015-07-15-building-an-ebike.md`
- `2016-11-27-new-ebike.md`
- `2018-03-30-stealth-bike.md`
- `2021-04-04-building-kyria.md`
- `2022-10-20-building-skeletyl.md`
- `2022-12-13-lp-kyria-build.md`

**Schema:**
```ts
title: string
description: string
date: Date
image: string
tags: string[]
status: 'active' | 'completed' | 'archived'  // defaults to 'completed'
draft?: boolean
```

**URL pattern:** `/portfolio/[slug]/`

---

## Pages

| Page | URL | Description |
|---|---|---|
| Home | `/` | Hero (avatar, name, tagline, CTA) + 6 most recent posts |
| Blog list | `/blog/` | Paginated post list, 8/page |
| Post | `/blog/[slug]/` | Full post with prev/next nav |
| Portfolio | `/portfolio/` | Grid of all 6 projects |
| Project | `/portfolio/[slug]/` | Full project write-up with prev/next nav |
| Tags | `/tags/` | All unique tags across posts + projects, with counts |
| Tag detail | `/tags/[tag]/` | Posts + projects for a tag, sorted by date |
| About | `/about/` | Static page |
| Contact | `/contact/` | Formspree form + privacy note |

**Blog pagination URL pattern:** `/blog/`, `/blog/2/`, `/blog/3/`

---

## Theme & Design System

### Design direction
Minimal / Editorial — content-first, generous white space, serif headlines.

### Color tokens — Atom One

**Dark (default):**
```css
--color-bg:          #282c34
--color-bg-subtle:   #2c313a
--color-border:      #3e4451
--color-text:        #abb2bf
--color-text-strong: #dde3ed
--color-accent:      #61afef
--color-accent-alt:  #98c379
--color-code-bg:     #21252b
```

**Light:**
```css
--color-bg:          #fafafa
--color-bg-subtle:   #f0f0f0
--color-border:      #d3d3d3
--color-text:        #383a42
--color-text-strong: #2c2f3a
--color-accent:      #4078f2
--color-accent-alt:  #50a14f
--color-code-bg:     #f0f0f0
```

### Theme toggle behavior
- Default: dark
- `<html data-theme="dark|light">` set by inline script in `<head>` before CSS loads — zero FOUC
- Priority order: `localStorage('theme')` → `prefers-color-scheme` → `dark`
- Toggle button in header persists selection to `localStorage`

### Typography
- Headlines: `Georgia, 'Times New Roman', serif`
- Body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Code: `'SFMono-Regular', Consolas, monospace`
- Fluid sizing via `clamp()`, base 16px scaling to 18px

### Layout
- Content max-width: `720px`
- Nav/footer max-width: `1100px`
- Breakpoints: `sm: 36em`, `md: 48em`, `lg: 64em`

### Syntax highlighting
Shiki with `one-dark-pro` (dark mode) and `github-light` (light mode). CSS variables swap themes on toggle. Configured in `astro.config.mjs`.

---

## Features

### Search (Pagefind)
- Runs as a post-build step: `pagefind --site dist`
- GitHub Actions workflow: build → pagefind → deploy
- Fully static, no server required

### RSS Feed
- `@astrojs/rss` generates at build time
- Output path: `/feed.xml` (matches old site URL — no subscriber breakage)

### Newsletter (Mailchimp)
- Signup form in footer on every page
- Endpoint: `mattgilbert.us3.list-manage.com/subscribe/post?u=d3eefd524203f624c236c441a&id=445854a897&f_id=00313ae2f0`

### Contact Form (Formspree)
- Form ID: `xzbwdyro`
- Fields: name, email, message
- Privacy note: "I will not store or collect your info or use your email address in any way other than to reply to your message."

---

## GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

**Steps:**
1. Trigger: push to `main`
2. `actions/setup-node` with LTS Node
3. `npm ci`
4. `npm run build` → outputs to `dist/`
5. `npx pagefind --site dist` → adds search index to `dist/`
6. `peaceiris/actions-gh-pages` deploys `dist/` to `gh-pages` branch

---

## Content Migration Plan

### Posts (24 files)
All `_posts/*.md` files **except** the 6 build journals → `src/content/posts/`
- Remove `layout: post` from frontmatter
- No other frontmatter changes required

### Projects (6 files)
The 6 build journal posts → `src/content/projects/`
- Remove `layout: post` from frontmatter
- Add `status: completed` to frontmatter

### Images
`images/` directory → `public/images/` (copied as-is)
- All image paths in post frontmatter (`/images/posts/...`) remain valid

### What is NOT migrated
- All Jekyll theme files (`_layouts/`, `_includes/`, `css/`, `js/`)
- `_config.yml`, `Gemfile`, `Gemfile.lock`
- `_site/` build output
- `feed.xml` (regenerated by Astro)
- `search.json` (replaced by Pagefind)
- Resume page (not included in new site)

---

## Social Links

| Platform | URL |
|---|---|
| RSS | `/feed.xml` |
| YouTube | `https://www.youtube.com/@mattgilb` |
| Reddit | `https://www.reddit.com/user/matt_gilbert/` |
| GitHub | `https://github.com/matt-gilb` |
| LinkedIn | `https://www.linkedin.com/in/mgilbert/` |
| Mastodon | `https://mastodon.social/@mattgilbert` |
| Bluesky | `https://bsky.app/profile/mattg01.bsky.social` |

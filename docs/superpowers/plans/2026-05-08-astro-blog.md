# Matt Gilbert Personal Blog — Astro + GitHub Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Astro static site replacing the Jekyll blog at mattgilbert.co, with Content Collections, Atom One dark/light theme toggle, Pagefind search, RSS feed, Mailchimp newsletter, Formspree contact form, and GitHub Actions deployment.

**Architecture:** Two Astro content collections (`posts` and `projects`) with typed schemas, rendered via shared layouts and components. Shiki dual-theme syntax highlighting toggled by `data-theme` on `<html>`. Pagefind runs post-build to generate a static search index. GitHub Actions builds on push to `main` and deploys to `gh-pages` using official GitHub Pages actions.

**Tech Stack:** Astro 5, @astrojs/rss, @astrojs/sitemap, Pagefind, Shiki (one-dark-pro / github-light), Vanilla CSS custom properties, GitHub Actions

**Old site location (read-only reference):** `/Users/matt/Projects/websites/matt-gilb.github.io/`

**Working directory for all tasks:** `/Users/matt/Projects/websites/my_site_2026/`

---

## File Map

| File | Purpose |
|---|---|
| `astro.config.mjs` | Site URL, integrations, Shiki dual-theme |
| `tsconfig.json` | TypeScript config (strict) |
| `src/content/config.ts` | Collection schemas for posts and projects |
| `src/content/posts/*.md` | 24 blog posts (migrated from old site) |
| `src/content/projects/*.md` | 6 build journal posts (migrated, typed as projects) |
| `src/styles/global.css` | CSS custom properties (Atom One), reset, base styles |
| `src/styles/syntax.css` | Shiki dual-theme overrides keyed to `data-theme` |
| `src/components/ThemeToggle.astro` | Dark/light button + `<script>` for toggle logic |
| `src/components/Header.astro` | Site nav links + ThemeToggle |
| `src/components/Footer.astro` | Mailchimp signup form + social icon links |
| `src/components/PostCard.astro` | Reusable post/project preview card |
| `src/components/TagList.astro` | Renders tag pills with `/tags/[tag]` links |
| `src/components/Pagination.astro` | Prev/next page navigation for blog list |
| `src/components/Search.astro` | Pagefind UI widget wrapper |
| `src/layouts/Base.astro` | Full HTML shell: head (anti-FOUC, CSS), Header, Footer |
| `src/layouts/Post.astro` | Blog post: hero image, meta, content, prev/next |
| `src/layouts/Page.astro` | Generic static page with title |
| `src/pages/index.astro` | Home: hero section + 6 most recent posts |
| `src/pages/blog/index.astro` | Blog listing page 1 (8 posts) |
| `src/pages/blog/page/[page].astro` | Blog listing pages 2+ |
| `src/pages/blog/[slug].astro` | Individual blog post |
| `src/pages/portfolio/index.astro` | Portfolio grid (all 6 projects) |
| `src/pages/portfolio/[slug].astro` | Individual project page |
| `src/pages/tags/index.astro` | All tags with post counts |
| `src/pages/tags/[tag].astro` | Posts + projects filtered by tag |
| `src/pages/about.astro` | Static about page |
| `src/pages/contact.astro` | Formspree contact form |
| `src/pages/search.astro` | Pagefind search UI |
| `src/pages/feed.xml.ts` | RSS feed (outputs to /feed.xml) |
| `public/CNAME` | Contains `mattgilbert.co` for GitHub Pages |
| `public/images/` | All images copied from old site |
| `public/favicon.*` | Favicons copied from old site |
| `.github/workflows/deploy.yml` | Build + Pagefind + deploy to gh-pages |

---

## Task 1: Initialize Astro project and configure git

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Scaffold project**

```bash
cd /Users/matt/Projects/websites/my_site_2026
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
```

When prompted, accept defaults. If the CLI is interactive despite flags, choose: minimal template, strict TypeScript, no git, no install.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/rss @astrojs/sitemap
npm install --save-dev pagefind
```

- [ ] **Step 3: Verify Astro installed**

```bash
npx astro --version
```

Expected: prints version like `astro v5.x.x`

- [ ] **Step 4: Initialize git and connect to remote**

```bash
git init
git remote add origin https://github.com/matt-gilb/matt-gilb.github.io.git
git checkout -b main
```

- [ ] **Step 5: Update .gitignore**

Append to the generated `.gitignore`:

```
.superpowers/
dist/
.env
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: initialize Astro project"
```

---

## Task 2: Configure astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Replace generated config with full config**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mattgilbert.co',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'one-dark-pro',
      },
      defaultColor: false,
    },
  },
});
```

- [ ] **Step 2: Verify config is valid**

```bash
npx astro check
```

Expected: no errors (there may be warnings about missing pages — that's fine at this stage).

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure Astro site, sitemap, and Shiki dual themes"
```

---

## Task 3: Content collection schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create the schema file**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    image: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['active', 'completed', 'archived']).default('completed'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, projects };
```

- [ ] **Step 2: Create empty content directories**

```bash
mkdir -p src/content/posts src/content/projects
```

- [ ] **Step 3: Verify schema compiles**

```bash
npx astro check
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define posts and projects content collection schemas"
```

---

## Task 4: Migrate content and assets

**Files:**
- Create: `src/content/posts/*.md` (24 files)
- Create: `src/content/projects/*.md` (6 files)
- Create: `public/images/` (directory copy)
- Create: `public/CNAME`
- Create: `public/favicon.*`

- [ ] **Step 1: Copy all 30 posts, stripping `layout:` frontmatter**

```bash
for f in /Users/matt/Projects/websites/matt-gilb.github.io/_posts/*.md; do
  sed '/^layout:/d' "$f" > "src/content/posts/$(basename "$f")"
done
```

- [ ] **Step 2: Move 6 build journal posts to projects/**

```bash
for f in \
  2015-07-15-building-an-ebike.md \
  2016-11-27-new-ebike.md \
  2018-03-30-stealth-bike.md \
  2021-04-04-building-kyria.md \
  2022-10-20-building-skeletyl.md \
  2022-12-13-lp-kyria-build.md; do
  mv "src/content/posts/$f" "src/content/projects/$f"
done
```

- [ ] **Step 3: Add `status: completed` to each project file**

```bash
for f in src/content/projects/*.md; do
  sed -i '' 's/^tags:/status: completed\ntags:/' "$f"
done
```

- [ ] **Step 4: Copy images and public assets**

```bash
cp -r /Users/matt/Projects/websites/matt-gilb.github.io/images public/
cp /Users/matt/Projects/websites/matt-gilb.github.io/favicon* public/
cp /Users/matt/Projects/websites/matt-gilb.github.io/apple-touch-icon* public/
cp /Users/matt/Projects/websites/matt-gilb.github.io/web-app-manifest* public/
```

- [ ] **Step 5: Create CNAME**

```bash
echo "mattgilbert.co" > public/CNAME
```

- [ ] **Step 6: Validate content collection schema**

```bash
npx astro check
```

Expected: no schema validation errors. If a post has a date format issue (e.g. `2021-01-04 00:00:00`), open that file and change the date value to `2021-01-04` (YYYY-MM-DD only).

- [ ] **Step 7: Commit**

```bash
git add src/content/ public/
git commit -m "feat: migrate posts, projects, images, and public assets"
```

---

## Task 5: Global CSS design system

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/syntax.css`

- [ ] **Step 1: Create global.css with Atom One tokens and base styles**

```css
/* src/styles/global.css */

/* ── Atom One Dark (default) ──────────────────────────── */
:root,
[data-theme="dark"] {
  --color-bg:          #282c34;
  --color-bg-subtle:   #2c313a;
  --color-border:      #3e4451;
  --color-text:        #abb2bf;
  --color-text-strong: #dde3ed;
  --color-accent:      #61afef;
  --color-accent-alt:  #98c379;
  --color-code-bg:     #21252b;
}

/* ── Atom One Light ───────────────────────────────────── */
[data-theme="light"] {
  --color-bg:          #fafafa;
  --color-bg-subtle:   #f0f0f0;
  --color-border:      #d3d3d3;
  --color-text:        #383a42;
  --color-text-strong: #2c2f3a;
  --color-accent:      #4078f2;
  --color-accent-alt:  #50a14f;
  --color-code-bg:     #f0f0f0;
}

/* ── Reset ────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
img, video { max-width: 100%; display: block; }

/* ── Base ─────────────────────────────────────────────── */
html { font-size: 100%; scroll-behavior: smooth; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.75;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* ── Typography ───────────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--color-text-strong);
  line-height: 1.25;
  margin-bottom: 0.5em;
}

h1 { font-size: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem); }
h2 { font-size: clamp(1.375rem, 1.25rem + 0.625vw, 1.75rem); }
h3 { font-size: clamp(1.125rem, 1rem + 0.5vw, 1.375rem); }

p { margin-bottom: 1.25em; }

a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
a:hover { opacity: 0.8; }

/* ── Layout ───────────────────────────────────────────── */
.container {
  width: 100%;
  max-width: 720px;
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.container--wide {
  max-width: 1100px;
}

/* ── Utilities ────────────────────────────────────────── */
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ── Prose (post body) ────────────────────────────────── */
.prose h2, .prose h3, .prose h4 { margin-top: 2em; }
.prose ul, .prose ol { padding-left: 1.5em; margin-bottom: 1.25em; }
.prose li { margin-bottom: 0.25em; }
.prose blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 1em;
  margin-left: 0;
  color: var(--color-text);
  font-style: italic;
}
.prose code:not(pre code) {
  background: var(--color-code-bg);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.875em;
}
.prose pre {
  background: var(--color-code-bg);
  border-radius: 8px;
  padding: 1.25em;
  overflow-x: auto;
  margin-bottom: 1.5em;
}
.prose img {
  border-radius: 8px;
  margin-block: 2em;
}
.prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-block: 2em;
}
```

- [ ] **Step 2: Create syntax.css for Shiki dual-theme**

```css
/* src/styles/syntax.css */
/* Dark mode (default): use Shiki dark theme variables */
.astro-code,
.astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

/* Light mode: switch to Shiki light theme variables */
[data-theme="light"] .astro-code,
[data-theme="light"] .astro-code span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
  font-style: var(--shiki-light-font-style) !important;
  font-weight: var(--shiki-light-font-weight) !important;
  text-decoration: var(--shiki-light-text-decoration) !important;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add Atom One design tokens and Shiki dual-theme syntax styles"
```

---

## Task 6: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle.astro`

- [ ] **Step 1: Create ThemeToggle.astro**

```astro
---
// src/components/ThemeToggle.astro
// Icons: sun (shown in dark mode), moon (shown in light mode)
---

<button id="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle dark/light mode">
  <!-- Sun icon: click to switch to light -->
  <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
  <!-- Moon icon: click to switch to dark -->
  <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</button>

<script>
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
</script>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    color: var(--color-text);
    display: flex;
    align-items: center;
    border-radius: 6px;
  }
  button:hover { color: var(--color-accent); }

  /* Show sun in dark mode (click → switch to light) */
  :global([data-theme="dark"]) .icon-moon { display: none; }
  /* Show moon in light mode (click → switch to dark) */
  :global([data-theme="light"]) .icon-sun { display: none; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ThemeToggle.astro
git commit -m "feat: add ThemeToggle component with sun/moon icons"
```

---

## Task 7: Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create Base.astro**

```astro
---
// src/layouts/Base.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
import '../styles/syntax.css';

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const {
  title,
  description = 'These are my thoughts, images, ideas, project journals, and dive trip reports.',
  image = '/images/social.jpg',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={canonicalURL} />

    <!-- Anti-FOUC: set theme before CSS loads -->
    <script is:inline>
      (function () {
        var stored = localStorage.getItem('theme');
        var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', stored || preferred || 'dark');
      })();
    </script>

    <title>{title} — Matt Gilbert</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={`${title} — Matt Gilbert`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />

    <!-- Favicons -->
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- RSS -->
    <link rel="alternate" type="application/rss+xml" title="Matt Gilbert" href="/feed.xml" />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add Base layout with anti-FOUC theme script and meta tags"
```

---

## Task 8: Header and Footer components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Header.astro**

```astro
---
// src/components/Header.astro
import ThemeToggle from './ThemeToggle.astro';

const nav = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Portfolio', href: '/portfolio/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

const current = Astro.url.pathname;
---

<header class="site-header">
  <div class="container container--wide header-inner">
    <a href="/" class="site-logo">Matt Gilbert</a>
    <nav aria-label="Main navigation">
      <ul>
        {nav.map(({ label, href }) => (
          <li>
            <a
              href={href}
              aria-current={current.startsWith(href) ? 'page' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <a href="/search/" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </a>
        </li>
      </ul>
    </nav>
    <ThemeToggle />
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding-block: 0.75rem;
  }
  .header-inner {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .site-logo {
    font-family: Georgia, serif;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text-strong);
    text-decoration: none;
    margin-right: auto;
  }
  nav ul {
    display: flex;
    list-style: none;
    gap: 0.25rem;
    align-items: center;
  }
  nav a {
    color: var(--color-text);
    text-decoration: none;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
  }
  nav a:hover,
  nav a[aria-current="page"] {
    color: var(--color-accent);
    background-color: var(--color-bg-subtle);
  }
  @media (max-width: 36em) {
    nav { display: none; }
  }
</style>
```

- [ ] **Step 2: Create Footer.astro**

```astro
---
// src/components/Footer.astro
const social = [
  { label: 'RSS', href: '/feed.xml', icon: 'rss' },
  { label: 'YouTube', href: 'https://www.youtube.com/@mattgilb', icon: 'youtube' },
  { label: 'GitHub', href: 'https://github.com/matt-gilb', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mgilbert/', icon: 'linkedin' },
  { label: 'Mastodon', href: 'https://mastodon.social/@mattgilbert', icon: 'mastodon' },
  { label: 'Bluesky', href: 'https://bsky.app/profile/mattg01.bsky.social', icon: 'bluesky' },
  { label: 'Reddit', href: 'https://www.reddit.com/user/matt_gilbert/', icon: 'reddit' },
];

const mailchimpAction =
  'https://mattgilbert.us3.list-manage.com/subscribe/post?u=d3eefd524203f624c236c441a&id=445854a897&f_id=00313ae2f0';
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="container container--wide footer-inner">

    <!-- Newsletter -->
    <div class="newsletter">
      <p class="newsletter-label">Get new posts in your inbox</p>
      <form action={mailchimpAction} method="POST" target="_blank" class="newsletter-form">
        <input type="email" name="EMAIL" placeholder="your@email.com" required aria-label="Email address" />
        <button type="submit">Subscribe</button>
        <!-- Mailchimp anti-bot field -->
        <div style="position:absolute;left:-5000px" aria-hidden="true">
          <input type="text" name="b_d3eefd524203f624c236c441a_445854a897" tabindex="-1" value="" />
        </div>
      </form>
    </div>

    <!-- Social links -->
    <nav aria-label="Social links" class="social-links">
      {social.map(({ label, href }) => (
        <a href={href} aria-label={label} rel="noopener noreferrer" target={href.startsWith('http') ? '_blank' : undefined}>
          {label}
        </a>
      ))}
    </nav>

    <p class="copyright">© {year} Matt Gilbert</p>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--color-border);
    padding-block: 2.5rem;
    margin-top: 4rem;
  }
  .footer-inner {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    text-align: center;
  }
  .newsletter-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }
  .newsletter-form {
    display: flex;
    gap: 0.5rem;
    position: relative;
  }
  .newsletter-form input[type="email"] {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg-subtle);
    color: var(--color-text);
    font-size: 0.9rem;
    min-width: 220px;
  }
  .newsletter-form button {
    padding: 0.5rem 1rem;
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    font-weight: 600;
  }
  .newsletter-form button:hover { opacity: 0.85; }
  .social-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .social-links a {
    font-size: 0.875rem;
    color: var(--color-text);
    text-decoration: none;
  }
  .social-links a:hover { color: var(--color-accent); }
  .copyright {
    font-size: 0.8rem;
    color: var(--color-text);
    opacity: 0.6;
    margin-bottom: 0;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add Header nav and Footer with Mailchimp + social links"
```

---

## Task 9: Shared components (PostCard, TagList, Pagination)

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagList.astro`
- Create: `src/components/Pagination.astro`

- [ ] **Step 1: Create PostCard.astro**

```astro
---
// src/components/PostCard.astro
interface Props {
  title: string;
  description: string;
  date: Date;
  image: string;
  tags: string[];
  href: string;
}

const { title, description, date, image, tags, href } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<article class="post-card">
  <a href={href} class="post-card-image-link" tabindex="-1" aria-hidden="true">
    <img src={image} alt="" loading="lazy" decoding="async" />
  </a>
  <div class="post-card-body">
    <div class="post-card-meta">
      <time datetime={date.toISOString()}>{formattedDate}</time>
      {tags.slice(0, 3).map(tag => (
        <a href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}/`} class="tag">{tag}</a>
      ))}
    </div>
    <h2 class="post-card-title">
      <a href={href}>{title}</a>
    </h2>
    <p class="post-card-desc">{description}</p>
  </div>
</article>

<style>
  .post-card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.25rem;
    padding-block: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }
  .post-card-image-link { display: block; border-radius: 8px; overflow: hidden; height: 140px; }
  .post-card-image-link img { width: 100%; height: 100%; object-fit: cover; }
  .post-card-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-size: 0.8125rem;
    color: var(--color-text);
    opacity: 0.7;
    margin-bottom: 0.35rem;
  }
  .tag {
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    padding: 0.1em 0.5em;
    border-radius: 4px;
    text-decoration: none;
    color: var(--color-accent-alt);
    font-size: 0.75rem;
  }
  .tag:hover { border-color: var(--color-accent-alt); }
  .post-card-title { font-size: 1.125rem; margin-bottom: 0.35rem; }
  .post-card-title a { color: var(--color-text-strong); text-decoration: none; }
  .post-card-title a:hover { color: var(--color-accent); }
  .post-card-desc { font-size: 0.9rem; line-height: 1.6; margin-bottom: 0; opacity: 0.85; }

  @media (max-width: 36em) {
    .post-card { grid-template-columns: 1fr; }
    .post-card-image-link { height: 180px; }
  }
</style>
```

- [ ] **Step 2: Create TagList.astro**

```astro
---
// src/components/TagList.astro
interface Props {
  tags: string[];
}
const { tags } = Astro.props;
---

<ul class="tag-list" role="list">
  {tags.map(tag => (
    <li>
      <a href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}/`} class="tag">
        {tag}
      </a>
    </li>
  ))}
</ul>

<style>
  .tag-list { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; }
  .tag {
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    padding: 0.2em 0.65em;
    border-radius: 4px;
    text-decoration: none;
    color: var(--color-accent-alt);
    font-size: 0.8125rem;
  }
  .tag:hover { border-color: var(--color-accent-alt); }
</style>
```

- [ ] **Step 3: Create Pagination.astro**

```astro
---
// src/components/Pagination.astro
interface Props {
  currentPage: number;
  totalPages: number;
  baseUrl: string; // e.g. "/blog"
}
const { currentPage, totalPages, baseUrl } = Astro.props;

const prev = currentPage > 1
  ? (currentPage === 2 ? `${baseUrl}/` : `${baseUrl}/page/${currentPage - 1}/`)
  : null;
const next = currentPage < totalPages ? `${baseUrl}/page/${currentPage + 1}/` : null;
---

{(prev || next) && (
  <nav class="pagination" aria-label="Pagination">
    {prev
      ? <a href={prev} class="page-link">← Newer posts</a>
      : <span class="page-link page-link--disabled">← Newer posts</span>
    }
    <span class="page-count">Page {currentPage} of {totalPages}</span>
    {next
      ? <a href={next} class="page-link">Older posts →</a>
      : <span class="page-link page-link--disabled">Older posts →</span>
    }
  </nav>
)}

<style>
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 2rem;
    font-size: 0.9375rem;
  }
  .page-link { color: var(--color-accent); text-decoration: none; }
  .page-link:hover { text-decoration: underline; }
  .page-link--disabled { color: var(--color-text); opacity: 0.4; }
  .page-count { font-size: 0.875rem; opacity: 0.6; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.astro src/components/TagList.astro src/components/Pagination.astro
git commit -m "feat: add PostCard, TagList, and Pagination components"
```

---

## Task 10: Post and Page layouts

**Files:**
- Create: `src/layouts/Post.astro`
- Create: `src/layouts/Page.astro`

- [ ] **Step 1: Create Post.astro**

```astro
---
// src/layouts/Post.astro
import Base from './Base.astro';
import TagList from '../components/TagList.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  image: string;
  tags: string[];
  prev?: { title: string; href: string } | null;
  next?: { title: string; href: string } | null;
}

const { title, description, date, image, tags, prev, next } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<Base title={title} description={description} image={image}>
  <article class="container">
    <header class="post-header">
      <div class="post-meta">
        <time datetime={date.toISOString()}>{formattedDate}</time>
      </div>
      <h1>{title}</h1>
      <TagList tags={tags} />
    </header>

    {image && (
      <img class="post-hero" src={image} alt="" loading="eager" decoding="async" />
    )}

    <div class="prose">
      <slot />
    </div>

    <footer class="post-footer">
      <nav class="post-nav" aria-label="Post navigation">
        {prev && (
          <a href={prev.href} class="post-nav-link post-nav-link--prev">
            <span class="post-nav-label">← Previous</span>
            <span class="post-nav-title">{prev.title}</span>
          </a>
        )}
        {next && (
          <a href={next.href} class="post-nav-link post-nav-link--next">
            <span class="post-nav-label">Next →</span>
            <span class="post-nav-title">{next.title}</span>
          </a>
        )}
      </nav>
    </footer>
  </article>
</Base>

<style>
  .post-header { padding-block: 2.5rem 1.5rem; }
  .post-meta { font-size: 0.875rem; opacity: 0.65; margin-bottom: 0.75rem; }
  .post-header h1 { margin-bottom: 0.75rem; }
  .post-hero {
    width: 100%;
    max-height: 480px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 2.5rem;
  }
  .post-footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--color-border); }
  .post-nav { display: flex; justify-content: space-between; gap: 1rem; }
  .post-nav-link {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-decoration: none;
    max-width: 45%;
  }
  .post-nav-link--next { text-align: right; margin-left: auto; }
  .post-nav-label { font-size: 0.8rem; opacity: 0.6; }
  .post-nav-title { font-size: 0.9375rem; color: var(--color-accent); }
  .post-nav-title:hover { text-decoration: underline; }
</style>
```

- [ ] **Step 2: Create Page.astro**

```astro
---
// src/layouts/Page.astro
import Base from './Base.astro';

interface Props {
  title: string;
  description?: string;
}
const { title, description } = Astro.props;
---

<Base title={title} description={description}>
  <div class="container page-content">
    <h1 class="page-title">{title}</h1>
    <div class="prose">
      <slot />
    </div>
  </div>
</Base>

<style>
  .page-content { padding-block: 3rem; }
  .page-title { margin-bottom: 2rem; }
</style>
```

- [ ] **Step 3: Verify types compile**

```bash
npx astro check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Post.astro src/layouts/Page.astro
git commit -m "feat: add Post and Page layouts"
```

---

## Task 11: Home page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace generated index.astro**

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 6);
---

<Base title="Home" description="These are my thoughts, images, ideas, project journals, and dive trip reports.">

  <!-- Hero -->
  <section class="hero">
    <div class="container hero-inner">
      <img src="/images/mattg.png" alt="Matt Gilbert" class="avatar" width="80" height="80" />
      <div>
        <h1>Hi! I'm Matt Gilbert</h1>
        <p class="hero-desc">These are my thoughts, images, ideas, project journals, and dive trip reports.</p>
        <a href="/blog/" class="cta">Read the blog →</a>
      </div>
    </div>
  </section>

  <!-- Recent posts -->
  <section class="container">
    <h2 class="section-heading">Recent Posts</h2>
    {posts.map(post => (
      <PostCard
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        image={post.data.image}
        tags={post.data.tags}
        href={`/blog/${post.slug}/`}
      />
    ))}
    <a href="/blog/" class="all-posts-link">All posts →</a>
  </section>

</Base>

<style>
  .hero {
    border-bottom: 1px solid var(--color-border);
    padding-block: 3.5rem;
    margin-bottom: 3rem;
  }
  .hero-inner {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }
  .avatar {
    border-radius: 50%;
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
  .hero h1 { margin-bottom: 0.5rem; }
  .hero-desc { font-size: 1.0625rem; margin-bottom: 1rem; opacity: 0.85; }
  .cta {
    display: inline-block;
    background: var(--color-accent);
    color: var(--color-bg);
    text-decoration: none;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9375rem;
  }
  .cta:hover { opacity: 0.85; }
  .section-heading { margin-bottom: 0.5rem; }
  .all-posts-link {
    display: inline-block;
    margin-top: 1.5rem;
    color: var(--color-accent);
    text-decoration: none;
    font-size: 0.9375rem;
  }
  .all-posts-link:hover { text-decoration: underline; }
  @media (max-width: 36em) {
    .hero-inner { flex-direction: column; text-align: center; }
  }
</style>
```

- [ ] **Step 2: Build and verify**

```bash
npx astro build
```

Expected: build completes, `dist/index.html` exists.

- [ ] **Step 3: Check in browser**

```bash
npx astro dev
```

Open `http://localhost:4321`. Verify: hero section appears, 6 recent posts show, dark theme is default.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with hero and recent posts"
```

---

## Task 12: Blog list pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/page/[page].astro`

- [ ] **Step 1: Create blog/index.astro (page 1)**

```astro
---
// src/pages/blog/index.astro
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
import Pagination from '../../components/Pagination.astro';
import { getCollection } from 'astro:content';

const PAGE_SIZE = 8;

const allPosts = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const posts = allPosts.slice(0, PAGE_SIZE);
const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
---

<Base title="Blog">
  <div class="container">
    <h1 class="page-heading">Blog</h1>
    {posts.map(post => (
      <PostCard
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        image={post.data.image}
        tags={post.data.tags}
        href={`/blog/${post.slug}/`}
      />
    ))}
    <Pagination currentPage={1} totalPages={totalPages} baseUrl="/blog" />
  </div>
</Base>

<style>
  .page-heading { padding-block: 2.5rem 0.5rem; }
</style>
```

- [ ] **Step 2: Create blog/page/[page].astro (pages 2+)**

```astro
---
// src/pages/blog/page/[page].astro
import Base from '../../../layouts/Base.astro';
import PostCard from '../../../components/PostCard.astro';
import Pagination from '../../../components/Pagination.astro';
import { getCollection } from 'astro:content';

const PAGE_SIZE = 8;

export async function getStaticPaths() {
  const allPosts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);

  return Array.from({ length: totalPages - 1 }, (_, i) => {
    const page = i + 2; // pages 2, 3, 4...
    return {
      params: { page: String(page) },
      props: {
        posts: allPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        currentPage: page,
        totalPages,
      },
    };
  });
}

const { posts, currentPage, totalPages } = Astro.props;
---

<Base title={`Blog — Page ${currentPage}`}>
  <div class="container">
    <h1 class="page-heading">Blog</h1>
    {posts.map(post => (
      <PostCard
        title={post.data.title}
        description={post.data.description}
        date={post.data.date}
        image={post.data.image}
        tags={post.data.tags}
        href={`/blog/${post.slug}/`}
      />
    ))}
    <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/blog" />
  </div>
</Base>

<style>
  .page-heading { padding-block: 2.5rem 0.5rem; }
</style>
```

- [ ] **Step 3: Build and verify**

```bash
npx astro build
```

Expected: `dist/blog/index.html` and `dist/blog/page/2/index.html` (and further pages) all exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add paginated blog list at /blog/"
```

---

## Task 13: Blog post page

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Create blog/[slug].astro**

```astro
---
// src/pages/blog/[slug].astro
import Post from '../../layouts/Post.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return posts.map((post, index) => ({
    params: { slug: post.slug },
    props: {
      post,
      prev: index < posts.length - 1
        ? { title: posts[index + 1].data.title, href: `/blog/${posts[index + 1].slug}/` }
        : null,
      next: index > 0
        ? { title: posts[index - 1].data.title, href: `/blog/${posts[index - 1].slug}/` }
        : null,
    },
  }));
}

const { post, prev, next } = Astro.props;
const { Content } = await post.render();
---

<Post
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  image={post.data.image}
  tags={post.data.tags}
  prev={prev}
  next={next}
>
  <Content />
</Post>
```

- [ ] **Step 2: Build and verify**

```bash
npx astro build
```

Expected: `dist/blog/building-an-ebike/` — wait, that's a project. Check any regular post slug appears under `dist/blog/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro
git commit -m "feat: add individual blog post pages at /blog/[slug]/"
```

---

## Task 14: Portfolio and project pages

**Files:**
- Create: `src/pages/portfolio/index.astro`
- Create: `src/pages/portfolio/[slug].astro`

- [ ] **Step 1: Create portfolio/index.astro**

```astro
---
// src/pages/portfolio/index.astro
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<Base title="Portfolio" description="Build journals, side projects, and hardware experiments.">
  <div class="container">
    <h1 class="page-heading">Portfolio</h1>
    <p class="page-desc">Build journals and side projects.</p>
    {projects.map(project => (
      <PostCard
        title={project.data.title}
        description={project.data.description}
        date={project.data.date}
        image={project.data.image}
        tags={project.data.tags}
        href={`/portfolio/${project.slug}/`}
      />
    ))}
  </div>
</Base>

<style>
  .page-heading { padding-block: 2.5rem 0.25rem; }
  .page-desc { opacity: 0.7; margin-bottom: 0.5rem; }
</style>
```

- [ ] **Step 2: Create portfolio/[slug].astro**

```astro
---
// src/pages/portfolio/[slug].astro
import Post from '../../layouts/Post.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const projects = (await getCollection('projects', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return projects.map((project, index) => ({
    params: { slug: project.slug },
    props: {
      project,
      prev: index < projects.length - 1
        ? { title: projects[index + 1].data.title, href: `/portfolio/${projects[index + 1].slug}/` }
        : null,
      next: index > 0
        ? { title: projects[index - 1].data.title, href: `/portfolio/${projects[index - 1].slug}/` }
        : null,
    },
  }));
}

const { project, prev, next } = Astro.props;
const { Content } = await project.render();
---

<Post
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  image={project.data.image}
  tags={project.data.tags}
  prev={prev}
  next={next}
>
  <Content />
</Post>
```

- [ ] **Step 3: Build and verify**

```bash
npx astro build
```

Expected: `dist/portfolio/index.html` exists; `dist/portfolio/building-kyria/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/portfolio/
git commit -m "feat: add portfolio listing and individual project pages"
```

---

## Task 15: Tags pages

**Files:**
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`

- [ ] **Step 1: Create tags/index.astro**

```astro
---
// src/pages/tags/index.astro
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('posts', ({ data }) => !data.draft);
const projects = await getCollection('projects', ({ data }) => !data.draft);

const tagCounts: Record<string, number> = {};
[...posts, ...projects].forEach(entry => {
  entry.data.tags.forEach(tag => {
    const key = tag.toLowerCase().replace(/\s+/g, '-');
    tagCounts[key] = (tagCounts[key] ?? 0) + 1;
  });
});

const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
---

<Base title="Tags">
  <div class="container">
    <h1 class="page-heading">Tags</h1>
    <ul class="tag-cloud" role="list">
      {tags.map(([tag, count]) => (
        <li>
          <a href={`/tags/${tag}/`} class="tag-item">
            {tag} <span class="tag-count">{count}</span>
          </a>
        </li>
      ))}
    </ul>
  </div>
</Base>

<style>
  .page-heading { padding-block: 2.5rem 1.5rem; }
  .tag-cloud { display: flex; flex-wrap: wrap; gap: 0.75rem; list-style: none; }
  .tag-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    padding: 0.35em 0.75em;
    border-radius: 6px;
    text-decoration: none;
    color: var(--color-text);
    font-size: 0.9rem;
  }
  .tag-item:hover { border-color: var(--color-accent); color: var(--color-accent); }
  .tag-count {
    background: var(--color-border);
    border-radius: 99px;
    padding: 0.1em 0.5em;
    font-size: 0.75rem;
    color: var(--color-text-strong);
  }
</style>
```

- [ ] **Step 2: Create tags/[tag].astro**

```astro
---
// src/pages/tags/[tag].astro
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  const tagMap: Record<string, Array<{ title: string; description: string; date: Date; image: string; tags: string[]; href: string }>> = {};

  const addEntry = (entry: typeof posts[0] | typeof projects[0], hrefBase: string) => {
    entry.data.tags.forEach(tag => {
      const key = tag.toLowerCase().replace(/\s+/g, '-');
      if (!tagMap[key]) tagMap[key] = [];
      tagMap[key].push({
        title: entry.data.title,
        description: entry.data.description,
        date: entry.data.date,
        image: entry.data.image,
        tags: entry.data.tags,
        href: `${hrefBase}${entry.slug}/`,
      });
    });
  };

  posts.forEach(p => addEntry(p, '/blog/'));
  projects.forEach(p => addEntry(p, '/portfolio/'));

  return Object.entries(tagMap).map(([tag, entries]) => ({
    params: { tag },
    props: {
      tag,
      entries: entries.sort((a, b) => b.date.valueOf() - a.date.valueOf()),
    },
  }));
}

const { tag, entries } = Astro.props;
---

<Base title={`Tag: ${tag}`}>
  <div class="container">
    <h1 class="page-heading">#{tag}</h1>
    <p class="entry-count">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
    {entries.map(entry => (
      <PostCard
        title={entry.title}
        description={entry.description}
        date={entry.date}
        image={entry.image}
        tags={entry.tags}
        href={entry.href}
      />
    ))}
  </div>
</Base>

<style>
  .page-heading { padding-block: 2.5rem 0.25rem; }
  .entry-count { opacity: 0.6; font-size: 0.9rem; margin-bottom: 0.5rem; }
</style>
```

- [ ] **Step 3: Build and verify**

```bash
npx astro build
```

Expected: `dist/tags/index.html` exists; tag-specific pages like `dist/tags/scuba/index.html` exist.

- [ ] **Step 4: Commit**

```bash
git add src/pages/tags/
git commit -m "feat: add tags index and tag detail pages spanning posts and projects"
```

---

## Task 16: About and Contact pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Check what's in the old about page**

```bash
cat /Users/matt/Projects/websites/matt-gilb.github.io/_pages/about.html
```

Use any relevant content for the About page below, or replace with a placeholder.

- [ ] **Step 2: Create about.astro**

```astro
---
// src/pages/about.astro
import Page from '../layouts/Page.astro';
---

<Page title="About" description="About Matt Gilbert — geek, diver, builder.">
  <img src="/images/mattg.png" alt="Matt Gilbert" style="border-radius: 50%; width: 120px; margin-bottom: 1.5rem;" />
  <p>
    Hi, I'm Matt Gilbert — a software engineer based in Atlanta, GA. I write about programming,
    electronics, building things, scuba diving, and travel.
  </p>
  <p>
    This blog is where I document projects, share trip reports, and occasionally write about
    whatever else catches my attention.
  </p>
  <h2>Find me online</h2>
  <ul>
    <li><a href="https://github.com/matt-gilb">GitHub</a></li>
    <li><a href="https://www.linkedin.com/in/mgilbert/">LinkedIn</a></li>
    <li><a href="https://mastodon.social/@mattgilbert" rel="me">Mastodon</a></li>
    <li><a href="https://bsky.app/profile/mattg01.bsky.social">Bluesky</a></li>
  </ul>
</Page>
```

Note: Update this content to match what's actually in the old about page (from Step 1).

- [ ] **Step 3: Create contact.astro**

```astro
---
// src/pages/contact.astro
import Page from '../layouts/Page.astro';
---

<Page title="Contact" description="Get in touch with Matt Gilbert.">
  <p>
    I want to hear from you! Fill out this form to send me an email.
    I will not store or collect your info or use your email address in any way
    other than to reply to your message. You will never get any spam from me.
  </p>

  <form
    action="https://formspree.io/f/xzbwdyro"
    method="POST"
    class="contact-form"
  >
    <label for="name">Name</label>
    <input id="name" type="text" name="name" required placeholder="Your name" />

    <label for="email">Email</label>
    <input id="email" type="email" name="_replyto" required placeholder="your@email.com" />

    <label for="message">Message</label>
    <textarea id="message" name="message" rows="6" required placeholder="Your message..."></textarea>

    <button type="submit">Send message</button>
  </form>
</Page>

<style>
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 2rem;
    max-width: 520px;
  }
  .contact-form label { font-size: 0.875rem; font-weight: 600; color: var(--color-text-strong); }
  .contact-form input,
  .contact-form textarea {
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-bg-subtle);
    color: var(--color-text);
    font-family: inherit;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  .contact-form input:focus,
  .contact-form textarea:focus {
    outline: 2px solid var(--color-accent);
    border-color: var(--color-accent);
  }
  .contact-form button {
    align-self: flex-start;
    padding: 0.6rem 1.5rem;
    background: var(--color-accent);
    color: var(--color-bg);
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  .contact-form button:hover { opacity: 0.85; }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/contact.astro
git commit -m "feat: add about and contact pages"
```

---

## Task 17: RSS feed

**Files:**
- Create: `src/pages/feed.xml.ts`

- [ ] **Step 1: Create feed.xml.ts**

```ts
// src/pages/feed.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Matt Gilbert',
    description: 'These are my thoughts, images, ideas, project journals, and dive trip reports.',
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
```

- [ ] **Step 2: Build and verify feed**

```bash
npx astro build && cat dist/feed.xml | head -20
```

Expected: valid RSS XML with `<channel>` and `<item>` elements.

- [ ] **Step 3: Commit**

```bash
git add src/pages/feed.xml.ts
git commit -m "feat: add RSS feed at /feed.xml"
```

---

## Task 18: Pagefind search

**Files:**
- Create: `src/pages/search.astro`
- Modify: `package.json`

- [ ] **Step 1: Create search.astro**

```astro
---
// src/pages/search.astro
import Base from '../layouts/Base.astro';
---

<Base title="Search">
  <div class="container search-page">
    <h1>Search</h1>
    <div id="search"></div>
  </div>
</Base>

<!-- Pagefind UI: only available after `astro build && pagefind` -->
<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js" is:inline></script>
<script is:inline>
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof window.PagefindUI !== 'undefined') {
      new window.PagefindUI({ element: '#search', showSubResults: true });
    } else {
      document.getElementById('search').innerHTML =
        '<p style="opacity:0.6">Search index not available in dev mode. Run <code>astro build</code> first.</p>';
    }
  });
</script>

<style>
  .search-page { padding-block: 3rem; }
  .search-page h1 { margin-bottom: 1.5rem; }
</style>
```

- [ ] **Step 2: Add build script to package.json**

Open `package.json` and update the `scripts` section:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:search": "astro build && npx pagefind --site dist",
    "preview": "astro preview"
  }
}
```

- [ ] **Step 3: Test Pagefind locally**

```bash
npm run build:search
npx astro preview
```

Open `http://localhost:4321/search/`. Type a word from a post title. Verify results appear.

- [ ] **Step 4: Commit**

```bash
git add src/pages/search.astro package.json
git commit -m "feat: add Pagefind search page"
```

---

## Task 19: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Enable GitHub Pages via GitHub Actions in repo settings**

In the browser, go to `https://github.com/matt-gilb/matt-gilb.github.io/settings/pages`. Under "Source", select **GitHub Actions** (not a branch). Save.

- [ ] **Step 2: Create deploy.yml**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site
        run: npm run build

      - name: Run Pagefind
        run: npx pagefind --site dist

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Do a final full build locally to confirm no errors**

```bash
npm run build:search
```

Expected: build completes with no errors, `dist/` has all pages.

- [ ] **Step 4: Push to GitHub**

```bash
git add .github/
git commit -m "feat: add GitHub Actions deployment workflow"
git push -u origin main
```

- [ ] **Step 5: Verify GitHub Actions run**

Go to `https://github.com/matt-gilb/matt-gilb.github.io/actions`. The workflow should start automatically. Wait for it to complete (green checkmark). Then open `https://mattgilbert.co` to verify the live site.

---

## Post-deployment checklist

- [ ] `https://mattgilbert.co` loads with dark theme by default
- [ ] Theme toggle switches between dark/light and persists on reload
- [ ] `/blog/` shows paginated post list
- [ ] A post page renders with correct hero image and syntax-highlighted code
- [ ] `/portfolio/` shows all 6 projects
- [ ] `/tags/` shows all tags with counts
- [ ] `/search/` returns results
- [ ] `/feed.xml` is valid RSS (paste URL into https://validator.w3.org/feed/)
- [ ] `/contact/` form submits to Formspree
- [ ] Footer Mailchimp form subscribes correctly
- [ ] `mattgilbert.co` CNAME resolves (custom domain active in GitHub Pages settings)

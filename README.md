# Mappa Mundi

**Live site:** https://sebastianscampo-gif.github.io/mappa-mundi/

A digital archive of 1,559 historical and contemporary maps from the Library of Congress, Wikimedia Commons, Natural Earth, USGS, the Bibliothèque nationale de France, and other open collections. Forty of those maps have a curated editorial essay covering significance, what the map reveals, and the distortions it carries.

## What's in this repo

Pure static HTML/CSS/JS — no build step, no backend, no dependencies. Everything ships as files served by GitHub Pages.

| File | What it does |
|---|---|
| `index.html` | Single-page entry point with all page shells |
| `app.js` | Application logic: hash routing, render functions for every page, i18n, theme toggle, smoke tests |
| `maps.js` | The dataset: 1,559 records with metadata, descriptions, and (for 40) curated essay fields |
| `maps-data.js` | Per-era SVG fallback generators (used when an image can't load) |
| `account.js` | Client-side auth + saved maps + history + notes + annotations (all in localStorage) |
| `styles.css` | Design system, design tokens, dark + light themes |
| `styles-pages.css` | Page-specific styles |
| `sw.js` | Service worker for offline support |
| `manifest.json` | PWA manifest |
| `favicon.svg`, `og-image.png` | Identity assets |
| `robots.txt`, `sitemap.xml`, `404.html` | SEO + GitHub Pages 404 handling |
| `AUDIT.md` | Project changelog — what was cleaned up, fixed, added, and why |

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Routes

The app uses hash routing — every page is reachable via a hash URL that survives refresh and is shareable.

- `#/home` — landing page with curated essays strip
- `#/archive` — 16 categories landing
- `#/archive/CATEGORY_KEY` — category detail with filters (era, year range, continent, language, tags, ficha quality, sort)
- `#/archive/_all?era=X&curated=1` — cross-category filtered view, sharable
- `#/map/MAP_ID` — individual map record with metadata, essays, citations, and (if available) curated significance / interpretation / biases
- `#/atlas` — meta-map: archive entries plotted geographically on a world projection
- `#/timeline` — horizontally scrollable timeline of nine historical eras
- `#/compare` — side-by-side or overlay map comparison
- `#/collections` — eleven themed collections
- `#/learn` — articles grid (one full article, seven outlines)
- `#/article/SLUG` — single article reader
- `#/glossary` — 30 cartographic terms with cross-links
- `#/about` — mission, audiences, stats, sources, privacy, educational use
- `#/library` — signed-in user's saved maps, history, notes, collections
- `#/account` — sign in / sign up / dashboard

## Features

- **Search** — diacritic-insensitive, token-based, prebuilt index across title, original title, author, region, country, description, historical context, tags, institution, continent, language, and category.
- **Filters** — historical era, year range (with BCE), continent, language, tags, ficha quality, sort.
- **Share links** — every filter combination is reflected in the URL hash (one click to "Copy share link").
- **Citation generator** — Chicago / APA / MLA on every map record, with copy-to-clipboard.
- **Compare** — five suggested preset pairings, synced zoom & pan, overlay with opacity slider.
- **Annotations** — double-click a map's image to drop a gold pin with a typed note. Persists per signed-in user.
- **i18n** — English / Spanish toggle for the chrome. Map content stays in source language.
- **Themes** — dark (default) and light. Persisted.
- **Accessibility** — focus-visible rings, skip-link, ARIA labels, respects `prefers-reduced-motion` and `prefers-contrast`.
- **Offline** — service worker pre-caches the app shell (~2 MB once cached).
- **SEO** — per-page titles + descriptions + canonical URLs + Open Graph + Twitter cards + JSON-LD on map detail pages. `robots.txt` + `sitemap.xml` for crawlers.
- **PWA** — installable as a standalone app on iOS / Android / desktop browsers.

## Privacy

All user data (account, saved maps, history, notes, annotations) lives in the browser's `localStorage`. There is no backend; nothing is transmitted to any server we control. No cookies. No analytics. See the `Privacy & data` section of the About page for details.

## License

- **Application code:** MIT (see `LICENSE`).
- **Map content:** distributed under the licence stated on each record — typically public domain or Creative Commons. Where the source institution requires attribution, it is shown on the map's detail page.

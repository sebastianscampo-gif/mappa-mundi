# Mappa Mundi

A digital archive of historical and contemporary cartography — 1,559 maps from the Library of Congress, Wikimedia Commons, Natural Earth, USGS, the Bibliothèque nationale de France, and other open collections.

## What's in this repo

Pure static HTML/CSS/JS — no build step.

- `index.html` — main entry point
- `app.js` — application logic, hash routing, all page rendering
- `maps.js` — the dataset (1,559 records)
- `maps-data.js` — SVG fallback generators (used when an image can't load)
- `account.js` — client-side auth + saved maps + history + notes (localStorage only)
- `styles.css`, `styles-pages.css` — design system and page styles
- `AUDIT.md` — content audit report (issues found, fixes applied, pending work)

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## License

Application code: yours.

Map images: each map's record links to its source institution. All maps are distributed under open licences — public domain or Creative Commons. Attribution requirements (where applicable) appear on the map's detail page.

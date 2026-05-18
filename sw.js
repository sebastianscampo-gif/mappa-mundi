// Mappa Mundi service worker
// Strategy:
//   - Pre-cache the app shell (HTML, CSS, JS) on install
//   - Network-first for HTML so updates show up; fall back to cache when offline
//   - Stale-while-revalidate for static assets: serve cache immediately AND fetch fresh in background
//   - Bumping CACHE_VERSION invalidates older caches and forces fresh shell

const CACHE_VERSION = "mappa-v6";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles-pages.css",
  "./app.js",
  "./maps-data.js",
  "./account.js",
  "./maps.js",
  "./favicon.svg",
  "./og-image.png",
  "./manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // For navigation requests (HTML), use network-first so updates appear
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // For other same-origin requests, stale-while-revalidate:
  // - Return whatever is in cache immediately (fast)
  // - In parallel, fetch from network and update the cache (so the next visit is fresh)
  // - If nothing is in cache, wait for the network
  e.respondWith(
    caches.match(req).then(cached => {
      const fetchAndUpdate = fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);  // if offline and no cache, just fall through
      return cached || fetchAndUpdate;
    })
  );
});


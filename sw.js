const CACHE_NAME = "paperlens-web-v0.13.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./viewer.html",
  "./viewer.css",
  "./viewer.js",
  "./diagnose.html",
  "./diagnose.js",
  "./polyfills.js",
  "./manifest.webmanifest",
  "./vendor/pdf.mjs",
  "./vendor/pdf.polyfilled.mjs",
  "./vendor/pdf.worker.mjs",
  "./vendor/pdf.worker.polyfilled.mjs",
  "./assets/sample-paper.pdf",
  "./icons/icon32.png",
  "./icons/icon128.png",
  "./icons/icon192.png",
  "./icons/icon512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("paperlens-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./viewer.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});

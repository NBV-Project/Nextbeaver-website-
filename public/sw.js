const CACHE_NAME = "nbv-cache-v3";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache only essential assets
      return cache.addAll([
        "/manifest.webmanifest",
        "/favicon.ico",
        "/favicon-16x16.png",
        "/favicon-32x32.png",
        "/favicon-48x48.png",
        "/icon/icon_192x192.png",
        "/icon/icon_512x512.png",
        "/icon/icon_192x192_maskable.png",
        "/icon/icon_512x512_maskable.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
    ])
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // Network First, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone it and update cache
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request);
      })
  );
});

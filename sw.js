const cacheName = "Font-Cache";
const runtimeCache = "RunTime-v1";
const precachedResources = ["/", "/assets/font/Nunito-VariableFont_wght.ttf"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(precachedResources))
      .then(self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [cacheName];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName),
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(runtimeCache).then((cache) => {
            // Store a copy of the network response in the runtime cache.
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // If the network request fails, return the cached response.
          return caches.match(event.request);
        }),
    );
  }
});

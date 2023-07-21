const cacheName = "Font-Cache";
const runtimeCache = "RunTime";
const precachedResources = ["/", "/assets/font/Nunito-VariableFont_wght.ttf"];

self.addEventListener("install", (event) => {
  console.log("hey");
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(precachedResources))
      .then(self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [cacheName];

  console.log("activate");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  console.log("fetch");
  if (event.request.url.startsWith(self.location.origin)) {
    console.log(event.request.url.startsWith(self.location.origin));
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(runtimeCache).then((cache) => {
          return fetch(event.request).then((response) => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});

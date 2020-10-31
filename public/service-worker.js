const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const STATIC_CACHE = "static-cache-v2";
const DATA_CACHE = "data-cache-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE)
      })
  );
});

self.addEventListener("fetch", function(event){
  if (event.request.url.includes("/api/")) {
    event.respondWith(
    caches.open(DATA_CACHE).then(cache => {
      return fetch(event.request).then(res => {
        if(res.status === 200) {
          cache.put(event.request.url, response.clone())
        }
        return response
      }).catch(err => {
        return cache.match(event.request)
      });
    }).catch(err => console.log(err))
    );
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => {
      caches.match(evt.request).then(function(response) {
        return response || fetch(evt.request);
      })
    }) 
  )
});
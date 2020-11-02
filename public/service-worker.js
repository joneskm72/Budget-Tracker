const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/index.html",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
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
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DATA_CACHE) {
            console.log("Removed data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
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
  // event.respondWith(
  //   fetch(event.request).catch(() => {
  //     return caches.match(event.request).then(response => {
  //       if(response) {
  //         return response;
  //       } else if (event.request.headers.get("accept").includes("text/html")) {
  //         return caches.match("/")
  //       }
  //     })
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }) 
  )
});
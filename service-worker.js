const CACHE = "btx-pront-v11b";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./db.js",
  "./presets.js",
  "./docs.js",
  "./manifest.webmanifest",
  "./assets/icon.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE) ? caches.delete(k) : null));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    }catch(e){
      return cached || Response.error();
    }
  })());
});

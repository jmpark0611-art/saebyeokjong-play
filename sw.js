const CACHE="saebyeokjong-pwa-v6";
const ASSETS=["./","./index.html","./manifest.webmanifest","./favicon.ico","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(hit=>{
      if(hit) return hit;
      return fetch(event.request).then(resp=>{
        if(resp && resp.ok && resp.type==="basic"){
          const copy=resp.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request, copy));
        }
        return resp;
      }).catch(()=>caches.match("./index.html"));
    })
  );
});

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const k of await caches.keys()) {
    if(k!==CACHE) await caches.delete(k);
  }
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try {
      const response=await fetch(event.request);
      if(response.ok && new URL(event.request.url).origin===location.origin) {
        const c=await caches.open(CACHE);
        c.put(event.request,response.clone());
      }
      return response;
    } catch(error) {
      return caches.match('./index.html');
    }
  })());
});

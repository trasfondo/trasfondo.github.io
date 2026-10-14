const V='trasfondo-v1';
const PRE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','favicon-32.png','og-card.png','fonts/fraunces-roman.woff2','fonts/fraunces-italic.woff2','fonts/alegreya-roman.woff2','fonts/alegreya-italic.woff2','fonts/inter.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(PRE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.headers.has('range')||r.destination==='audio'||r.destination==='video')return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html').then(h=>h||caches.match('./'))));return;}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));
});

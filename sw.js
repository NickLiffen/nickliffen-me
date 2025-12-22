var VERSION = '7';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
      '/',
      '/sw.js',
      '/index.html',
      '/404.html',
      '/css/hyde.css',
      '/css/poole.css',
      '/articles/review-ghas-code-scanning-enterprise.html',
      '/articles/building-a-simple-website.html',
      '/articles/centralised-vs-decentralised-devops.html',
      '/articles/innersourcing.html',
      '/articles/step-functions.html',
      'articles/developer-evolution.html',
      '/articles/page/2.html'
    ]);
  }))
});

this.addEventListener('fetch', function(e) {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;
  
  // Skip requests with different modes that can cause redirect issues
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  var tryInCachesFirst = caches.open(VERSION).then(cache => {
    return cache.match(e.request).then(response => {
      if (!response) {
        return handleNoCacheMatch(e);
      }
      fetchFromNetworkAndCache(e);
      return response
    });
  });
  e.respondWith(tryInCachesFirst);
});

this.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.map(key => {
      if (key !== VERSION)
        return caches.delete(key);
    }));
  }));
});

function fetchFromNetworkAndCache(e) {
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

  return fetch(e.request).then(res => {
    if (!res.url) return res;
    if (new URL(res.url).origin !== location.origin) return res;

    return caches.open(VERSION).then(cache => {
      // TODO: figure out if the content is new and therefore the page needs a reload.
      cache.put(e.request, res.clone());
      return res;
    });
  }).catch(err => console.error(e.request.url, err));
}

function handleNoCacheMatch(e) {
  return fetchFromNetworkAndCache(e);
}

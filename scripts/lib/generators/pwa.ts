/**
 * PWA generators: manifest.webmanifest and sw.js
 */

import fs from 'fs';
import path from 'path';
import { DIST_DIR, ARTICLES_PER_INDEX, ARTICLES_PER_PAGE } from '../config';
import type { Article, ManifestShortcut } from '../types';

/** Generate manifest.webmanifest with dynamic article shortcuts */
export async function generateManifest(articles: Article[]): Promise<void> {
  const shortcuts: ManifestShortcut[] = articles.slice(0, 6).map(a => {
    // Clean up title for short_name
    let shortName = a.title
      .replace(/^Nick Liffen's Blog \| /, '')
      .replace(/ \| Blog Post$/, '');
    
    if (shortName.length > 40) {
      shortName = shortName.substring(0, 37) + '...';
    }
    
    return {
      name: a.title,
      url: `/articles/${a.slug}.html`,
      short_name: shortName
    };
  });

  const manifest = {
    short_name: "Nick Liffen's Blog",
    name: "Nick Liffen's Blog | Technology, DevOps and Developer Blog",
    icons: [
      { src: "icon.png", type: "image/png", sizes: "192x192", purpose: "any maskable" },
      { src: "tile.png", type: "image/png", sizes: "512x512", purpose: "any maskable" }
    ],
    start_url: "./",
    scope: ".",
    background_color: "#fafafa",
    theme_color: "#fafafa",
    display: "standalone",
    categories: ["education", "security"],
    description: "Nick Liffen's Blog | Focusing on DevOps, Developer Experience and all aspects of Technology",
    dir: "auto",
    lang: "en-GB",
    shortcuts: [
      { name: "Nick Liffen's Blog | Technology, DevOps and Developer Blog", url: "/", short_name: "Blog Home Page" },
      ...shortcuts
    ]
  };

  fs.writeFileSync(
    path.join(DIST_DIR, 'manifest.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated: manifest.webmanifest');
}

/** Generate sw.js with dynamic cache list */
export async function generateServiceWorker(articles: Article[]): Promise<void> {
  const version = Date.now().toString(36);
  
  // Calculate pagination pages
  const paginatedArticles = articles.slice(ARTICLES_PER_INDEX);
  const totalPages = Math.ceil(paginatedArticles.length / ARTICLES_PER_PAGE);
  const paginationPages = Array.from({ length: totalPages }, (_, i) => `/articles/page/${i + 2}.html`);

  const cacheUrls = [
    '/',
    '/sw.js',
    '/index.html',
    '/404.html',
    '/css/hyde.css',
    '/css/poole.css',
    ...articles.map(a => `/articles/${a.slug}.html`),
    ...paginationPages
  ];

  const sw = `var VERSION = '${version}';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
${cacheUrls.map(url => `      '${url}'`).join(',\n')}
    ]);
  }))
});

this.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  
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
      cache.put(e.request, res.clone());
      return res;
    });
  }).catch(err => console.error(e.request.url, err));
}

function handleNoCacheMatch(e) {
  return fetchFromNetworkAndCache(e);
}
`;

  fs.writeFileSync(path.join(DIST_DIR, 'sw.js'), sw);
  console.log('Generated: sw.js');
}

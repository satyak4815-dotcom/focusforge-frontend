/* FocusForge — cache strategies for offline shell + fresh API where possible */

const STATIC_CACHE = 'focusforge-static-v1';
const RUNTIME_CACHE = 'focusforge-runtime-v1';

/** Core shell URLs (add real icon paths once assets exist in /public/icons/) */
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
              return caches.delete(key);
            }
            return undefined;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

function sameOrigin(url) {
  return url.origin === self.location.origin;
}

function isStaticAssetRequest(request) {
  if (request.method !== 'GET') return false;
  const dest = request.destination;
  if (dest === 'style' || dest === 'script' || dest === 'image' || dest === 'font') {
    return true;
  }
  if (request.mode === 'navigate') {
    return true;
  }
  const url = new URL(request.url);
  if (sameOrigin(url) && url.pathname.match(/\.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i)) {
    return true;
  }
  return false;
}

function isApiOrDynamicRequest(request) {
  if (request.method !== 'GET') return true;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api')) return true;
  if (url.hostname.includes('onrender.com') && url.pathname.includes('api')) return true;
  if (url.hostname.endsWith('.supabase.co')) return true;
  if (sameOrigin(url) && url.pathname !== '/' && !url.pathname.includes('.')) {
    return true;
  }
  return false;
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request, { ignoreSearch: false });
  if (cached) return cached;
  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.ok) {
    try {
      await cache.put(request, networkResponse.clone());
    } catch (_) {
      /* opaque or non-cacheable */
    }
  }
  return networkResponse;
}

async function networkFirst(request) {
  if (request.method !== 'GET') {
    return fetch(request);
  }
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      try {
        await cache.put(request, networkResponse.clone());
      } catch (_) {
        /* ignore cache write failures */
      }
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return;
  }
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  if (isApiOrDynamicRequest(request) && !isStaticAssetRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAssetRequest(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});

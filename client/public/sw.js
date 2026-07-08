/**
 * Pawn IDE Service Worker
 * Implements offline-first strategy with cache management
 * Caches all assets on first load and serves from cache when offline
 */

const CACHE_NAME = 'pawn-ide-v1';
const RUNTIME_CACHE = 'pawn-ide-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Failed to cache some assets:', err);
        // Continue even if some assets fail to cache
        return Promise.resolve();
      });
    })
  );
  
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients
  self.clients.claim();
});

// Fetch event - implement offline-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {\n    return;
  }\n  \n  // Skip non-GET requests\n  if (request.method !== 'GET') {\n    return;\n  }\n  \n  // Strategy: Cache first, then network (for static assets)\n  if (isStaticAsset(url.pathname)) {\n    event.respondWith(\n      caches.match(request).then((response) => {\n        if (response) {\n          return response;\n        }\n        \n        return fetch(request)\n          .then((response) => {\n            // Don't cache non-successful responses\n            if (!response || response.status !== 200 || response.type === 'error') {\n              return response;\n            }\n            \n            // Clone the response before caching\n            const responseToCache = response.clone();\n            caches.open(RUNTIME_CACHE).then((cache) => {\n              cache.put(request, responseToCache);\n            });\n            \n            return response;\n          })\n          .catch(() => {\n            // Return offline page or cached response\n            return caches.match(request) || createOfflineResponse();\n          });\n      })\n    );\n  } else {\n    // Strategy: Network first, then cache (for dynamic content)\n    event.respondWith(\n      fetch(request)\n        .then((response) => {\n          if (!response || response.status !== 200 || response.type === 'error') {\n            return response;\n          }\n          \n          const responseToCache = response.clone();\n          caches.open(RUNTIME_CACHE).then((cache) => {\n            cache.put(request, responseToCache);\n          });\n          \n          return response;\n        })\n        .catch(() => {\n          return caches.match(request) || createOfflineResponse();\n        })\n    );\n  }\n});\n\n/**\n * Determine if a URL is a static asset\n */\nfunction isStaticAsset(pathname) {\n  const staticExtensions = [\n    '.js',\n    '.css',\n    '.png',\n    '.jpg',\n    '.jpeg',\n    '.gif',\n    '.svg',\n    '.woff',\n    '.woff2',\n    '.ttf',\n    '.eot',\n    '.ico',\n    '.json',\n  ];\n  \n  return staticExtensions.some((ext) => pathname.endsWith(ext)) || pathname === '/';\n}\n\n/**\n * Create offline response\n */\nfunction createOfflineResponse() {\n  return new Response(\n    `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Pawn IDE - Offline</title>\n  <style>\n    body {\n      margin: 0;\n      padding: 20px;\n      background-color: #0f1419;\n      color: #e4e6eb;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      min-height: 100vh;\n    }\n    .container {\n      text-align: center;\n      max-width: 400px;\n    }\n    h1 {\n      font-size: 24px;\n      margin: 0 0 10px 0;\n      color: #10b981;\n    }\n    p {\n      margin: 0;\n      line-height: 1.6;\n      color: #6b7280;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"container\">\n    <h1>You're Offline</h1>\n    <p>Pawn IDE is loading. Please wait or check your connection.</p>\n  </div>\n</body>\n</html>`,\n    {\n      status: 200,\n      statusText: 'OK',\n      headers: {\n        'Content-Type': 'text/html; charset=utf-8',\n      },\n    }\n  );\n}\n\n/**\n * Message handler for cache management\n */\nself.addEventListener('message', (event) => {\n  if (event.data && event.data.type === 'SKIP_WAITING') {\n    self.skipWaiting();\n  }\n  \n  if (event.data && event.data.type === 'CLEAR_CACHE') {\n    caches.keys().then((cacheNames) => {\n      Promise.all(\n        cacheNames.map((cacheName) => caches.delete(cacheName))\n      );\n    });\n  }\n});\n

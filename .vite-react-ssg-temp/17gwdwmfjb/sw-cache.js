/**
 * Service Worker for Blog Cache Management
 * Implements intelligent caching strategies for blog content
 */

const CACHE_VERSION = 'blog-cache-v1';
const CACHE_NAMES = {
  STATIC: `${CACHE_VERSION}-static`,
  API: `${CACHE_VERSION}-api`,
  IMAGES: `${CACHE_VERSION}-images`,
  PAGES: `${CACHE_VERSION}-pages`
};

// Cache TTL in milliseconds
const CACHE_TTL = {
  STATIC: 24 * 60 * 60 * 1000, // 24 hours
  API: 5 * 60 * 1000, // 5 minutes
  IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 days
  PAGES: 60 * 60 * 1000 // 1 hour
};

// Resources to cache on install
const STATIC_RESOURCES = [
  '/',
  '/blog',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// API endpoints that should be cached
const CACHEABLE_API_PATTERNS = [
  /\/api\/posts/,
  /\/api\/categories/,
  /\/api\/health/
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.STATIC).then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_RESOURCES.map(url => new Request(url, { cache: 'reload' })));
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!Object.values(CACHE_NAMES).includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine cache strategy based on request type
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isPageRequest(url)) {
    event.respondWith(handlePageRequest(request));
  } else if (isStaticResource(url)) {
    event.respondWith(handleStaticRequest(request));
  }
});

// Check if request is for API
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || 
         CACHEABLE_API_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for images
function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
}

// Check if request is for a page
function isPageRequest(url) {
  return url.pathname.startsWith('/blog') || 
         url.pathname === '/' ||
         !url.pathname.includes('.');
}

// Check if request is for static resource
function isStaticResource(url) {
  return url.pathname.startsWith('/static/') ||
         /\.(css|js|json|ico)$/i.test(url.pathname);
}

// Handle API requests with stale-while-revalidate strategy
async function handleAPIRequest(request) {
  const cache = await caches.open(CACHE_NAMES.API);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still fresh
  if (cachedResponse && isFresh(cachedResponse, CACHE_TTL.API)) {
    // Serve from cache and optionally update in background
    const shouldRevalidate = Math.random() < 0.1; // 10% chance to revalidate
    if (shouldRevalidate) {
      event.waitUntil(updateCache(cache, request));
    }
    return cachedResponse;
  }
  
  try {
    // Try to fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const responseToCache = networkResponse.clone();
      await cache.put(request, addTimestamp(responseToCache));
      
      return networkResponse;
    } else {
      // Serve stale cache if network fails
      return cachedResponse || new Response(
        JSON.stringify({ error: 'Content not available offline' }),
        { status: 503, statusText: 'Service Unavailable' }
      );
    }
  } catch (error) {
    console.log('[SW] Network request failed, serving from cache:', error);
    return cachedResponse || new Response(
      JSON.stringify({ error: 'Content not available offline' }),
      { status: 503, statusText: 'Service Unavailable' }
    );
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(CACHE_NAMES.IMAGES);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, addTimestamp(networkResponse.clone()));
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Image request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  const cache = await caches.open(CACHE_NAMES.PAGES);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, addTimestamp(networkResponse.clone()));
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Page request failed, serving from cache:', error);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Page not available offline', { status: 503 });
  }
}

// Handle static resources with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAMES.STATIC);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, addTimestamp(networkResponse.clone()));
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Static resource request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Update cache in background
async function updateCache(cache, request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, addTimestamp(response.clone()));
      
      // Notify clients about cache update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_UPDATED',
            data: { url: request.url, timestamp: Date.now() }
          });
        });
      });
    }
  } catch (error) {
    console.log('[SW] Background cache update failed:', error);
    
    // Notify clients about cache error
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_ERROR',
          data: { url: request.url, error: error.message }
        });
      });
    });
  }
}

// Add timestamp to response for TTL checking
function addTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-at', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Check if cached response is still fresh
function isFresh(response, ttl) {
  const cachedAt = parseInt(response.headers.get('sw-cached-at') || '0');
  return (Date.now() - cachedAt) < ttl;
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(data.urls));
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCaches(data.cacheNames));
      break;
      
    case 'GET_CACHE_INFO':
      event.waitUntil(getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      }));
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAMES.API);
  
  try {
    await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, addTimestamp(response));
        }
      })
    );
    console.log('[SW] URLs cached successfully:', urls);
  } catch (error) {
    console.error('[SW] Failed to cache URLs:', error);
  }
}

// Clear specified caches
async function clearCaches(cacheNames = []) {
  if (cacheNames.length === 0) {
    cacheNames = Object.values(CACHE_NAMES);
  }
  
  try {
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('[SW] Caches cleared:', cacheNames);
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
  }
}

// Get cache information
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {};
  
  for (const cacheName of cacheNames) {
    if (Object.values(CACHE_NAMES).includes(cacheName)) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      info[cacheName] = {
        size: keys.length,
        urls: keys.map(request => request.url)
      };
    }
  }
  
  return {
    version: CACHE_VERSION,
    caches: info,
    timestamp: Date.now()
  };
}

console.log('[SW] Service Worker loaded successfully');
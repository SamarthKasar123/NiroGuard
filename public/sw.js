// NiroGuard Service Worker for offline functionality and background sync
const CACHE_NAME = 'niroguard-v1.0.0';
const API_CACHE_NAME = 'niroguard-api-v1.0.0';
const STATIC_CACHE_NAME = 'niroguard-static-v1.0.0';

// Static assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  // Add other static assets as needed
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/health-reports',
  '/api/water-quality',
  '/api/user-profile',
  '/api/emergency-contacts',
  '/api/education-content'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('NiroGuard Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('API cache opened');
        return cache;
      })
    ])
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('NiroGuard Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch Strategy - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Default fetch
  event.respondWith(fetch(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } else {
      throw new Error('Network response not ok');
    }
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or error response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires internet connection',
        cached: false
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch static asset:', error);
    
    // Return offline fallback for documents
    if (request.destination === 'document') {
      return cache.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'health-report-sync') {
    event.waitUntil(syncHealthReports());
  } else if (event.tag === 'water-quality-sync') {
    event.waitUntil(syncWaterQualityReports());
  } else if (event.tag === 'case-update-sync') {
    event.waitUntil(syncCaseUpdates());
  }
});

// Sync pending health reports
async function syncHealthReports() {
  try {
    const pendingReports = await getStoredData('pendingHealthReports');
    
    for (const report of pendingReports) {
      try {
        const response = await fetch('/api/health-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report)
        });
        
        if (response.ok) {
          await removeStoredData('pendingHealthReports', report.id);
          console.log('Health report synced:', report.id);
        }
      } catch (error) {
        console.log('Failed to sync health report:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Sync pending water quality reports
async function syncWaterQualityReports() {
  try {
    const pendingReports = await getStoredData('pendingWaterReports');
    
    for (const report of pendingReports) {
      try {
        const response = await fetch('/api/water-quality', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report)
        });
        
        if (response.ok) {
          await removeStoredData('pendingWaterReports', report.id);
          console.log('Water quality report synced:', report.id);
        }
      } catch (error) {
        console.log('Failed to sync water quality report:', error);
      }
    }
  } catch (error) {
    console.log('Water quality sync failed:', error);
  }
}

// Sync pending case updates
async function syncCaseUpdates() {
  try {
    const pendingUpdates = await getStoredData('pendingCaseUpdates');
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch(`/api/cases/${update.caseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update.data)
        });
        
        if (response.ok) {
          await removeStoredData('pendingCaseUpdates', update.id);
          console.log('Case update synced:', update.id);
        }
      } catch (error) {
        console.log('Failed to sync case update:', error);
      }
    }
  } catch (error) {
    console.log('Case update sync failed:', error);
  }
}

// Push Notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: 'New health alert in your area',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-dismiss.png'
      }
    ],
    requireInteraction: true
  };
  
  if (event.data) {
    const payload = event.data.json();
    options.body = payload.body || options.body;
    options.title = payload.title || 'NiroGuard Alert';
    options.data = { ...options.data, ...payload.data };
  }
  
  event.waitUntil(
    self.registration.showNotification('NiroGuard Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/alerts')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utility functions for IndexedDB operations
async function getStoredData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NiroGuardDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

async function removeStoredData(storeName, itemId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NiroGuardDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(itemId);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Periodic background sync for critical data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'critical-health-sync') {
    event.waitUntil(syncCriticalHealthData());
  }
});

async function syncCriticalHealthData() {
  try {
    // Sync critical health alerts
    const response = await fetch('/api/critical-alerts');
    if (response.ok) {
      const alerts = await response.json();
      const cache = await caches.open(API_CACHE_NAME);
      cache.put('/api/critical-alerts', new Response(JSON.stringify(alerts)));
    }
  } catch (error) {
    console.log('Critical health data sync failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(payload.urls));
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearCache(payload.cacheName));
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(urls);
}

async function clearCache(cacheName) {
  return caches.delete(cacheName || CACHE_NAME);
}

console.log('NiroGuard Service Worker loaded successfully');
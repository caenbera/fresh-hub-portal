/// <reference lib="webworker" />

// Cache version
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'fresh-hub-cache-' + CACHE_VERSION;

// Archivos a cachear
const urlsToCache = [
  '/',
  '/es',
  '/en',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker instalado');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker activado');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta las peticiones
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si está en cache, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en cache, hacer la petición
        return fetch(event.request).then(
          function(response) {
            // Si la respuesta es válida, guardarla en cache
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Notificaciones Push
self.addEventListener('push', function(event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'Fresh Hub';
    const options = {
      body: data.body || '',
      icon: '/icon-512.png',
      badge: '/icon-512.png',
      requireInteraction: false,
      silent: false
    };

    if (data.data && data.data.url) {
      options.data = { url: data.data.url };
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Error parsing push notification:', error);
    event.waitUntil(
      self.registration.showNotification('Fresh Hub', {
        body: 'Tienes una nueva notificación',
        icon: '/icon-512.png',
        badge: '/icon-512.png'
      })
    );
  }
});

// Cuando el usuario hace clic en la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let urlToOpen = '/es';
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ('focus' in client && 'navigate' in client) {
          client.focus();
          if (urlToOpen !== client.url) {
            client.navigate(urlToOpen);
          }
          return;
        }
      }
      
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

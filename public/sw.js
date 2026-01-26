/// <reference lib="webworker" />

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

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let urlToOpen = '/';
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'Fresh Hub';
  const options: NotificationOptions = {
    body: data.body || '',
    icon: 'https://i.postimg.cc/sxBVGnMp/icon.png?v=2',
    badge: 'https://i.postimg.cc/sxBVGnMp/icon.png?v=2',
    data: {},
    requireInteraction: false,
    silent: false
  };

  if (data.data && data.data.url) {
    options.data.url = data.data.url;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let urlToOpen = '/';
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if the app is already open at the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window
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

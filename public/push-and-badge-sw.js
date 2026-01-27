// Badge API y Notificaciones Push para Fresh Hub Portal
// Este archivo se importa automáticamente en el Service Worker

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
  
      // Mostrar notificación
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
  
      // Actualizar Badge API con contador
      if ('setAppBadge' in navigator) {
        event.waitUntil(
          (async () => {
            try {
              // Incrementar contador de badge
              const currentCount = await self.registration.getBadge();
              const newCount = currentCount ? currentCount + 1 : 1;
              await navigator.setAppBadge(newCount);
            } catch (error) {
              console.error('Error setting badge:', error);
            }
          })()
        );
      }
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
  
    let urlToOpen = '/es'; // Tu landing page
    if (event.notification.data && event.notification.data.url) {
      urlToOpen = event.notification.data.url;
    }
  
    // Limpiar badge cuando se abre la notificación
    if ('clearAppBadge' in navigator) {
      event.waitUntil(
        navigator.clearAppBadge().catch(console.error)
      );
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
  
  // Helper para obtener badge actual (Workaround para getBadge)
  self.registration.getBadge = async () => {
    // Guardar contador en IndexedDB
    const dbName = 'fresh-hub-badge';
    return new Promise((resolve) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('badge')) {
          db.createObjectStore('badge', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('badge', 'readonly');
        const store = transaction.objectStore('badge');
        const getRequest = store.get('count');
        
        getRequest.onsuccess = function() {
          const count = getRequest.result ? getRequest.result.value : 0;
          resolve(count);
        };
        
        getRequest.onerror = function() {
          resolve(0);
        };
      };
      
      request.onerror = function() {
        resolve(0);
      };
    });
  };
  
  // Guardar badge en IndexedDB
  self.registration.setBadge = async (count) => {
    const dbName = 'fresh-hub-badge';
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('badge')) {
          db.createObjectStore('badge', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('badge', 'readwrite');
        const store = transaction.objectStore('badge');
        const putRequest = store.put({ id: 'count', value: count });
        
        putRequest.onsuccess = resolve;
        putRequest.onerror = reject;
      };
      
      request.onerror = reject;
    });
  };
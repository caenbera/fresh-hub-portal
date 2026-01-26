/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Configuración de Firebase (misma que en tu app)
  const firebaseConfig = {
    apiKey: "AIzaSyA8fBBeVEYQByO3HuU3xECXTyda5g82iuQ", // ← Tu apiKey real
    authDomain: "fresh-hub-portal.firebaseapp.com",
    projectId: "fresh-hub-portal",
    storageBucket: "fresh-hub-portal.firebasestorage.app",
    messagingSenderId: "313694782184", // ← Tu messagingSenderId real
    appId: "1:313694782184:web:3052d3a83bdbb30be47f5d" // ← Tu appId real
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Maneja mensajes en segundo plano
onBackgroundMessage(messaging, (payload) => {
  const notificationTitle = payload.notification?.title || 'Fresh Hub';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: 'https://i.postimg.cc/sxBVGnMp/icon.png?v=2',
    badge: 'https://i.postimg.cc/sxBVGnMp/icon.png?v=2',
    data: {
      url: payload.data?.url || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
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

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    // Importar tu código de notificaciones y badge
    importScripts: ['/push-and-badge-sw.js'],
    // Estrategias de caché para Next.js con rutas dinámicas
    runtimeCaching: [
      // Cache para páginas HTML (landing, login, register)
      {
        urlPattern: /^https:\/\/fresh-hub-portal\.vercel\.app\/.*$/,
        handler: 'NetworkFirst' as const,
        options: {
          cacheName: 'pages-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 1 día
          },
          networkTimeoutSeconds: 10,
        },
      },
      // Cache para API calls
      {
        urlPattern: /^https:\/\/.*\/api\/.*$/,
        handler: 'NetworkFirst' as const,
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60, // 5 minutos
          },
          networkTimeoutSeconds: 10,
        },
      },
      // Cache para imágenes
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
          },
        },
      },
      // Cache para archivos estáticos (CSS, JS, fonts)
      {
        urlPattern: /\.(?:js|css|woff|woff2|ttf)$/i,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'static-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withPWA(withNextIntl(nextConfig));
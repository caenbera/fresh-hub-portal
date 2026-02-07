// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.postimg.cc',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 's.groovevideo.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
        ],
    },
};

const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');
 
module.exports = withNextIntl(nextConfig);

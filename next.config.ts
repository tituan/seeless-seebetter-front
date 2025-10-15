// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true, // OK en top-level
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Domaines simples (host only)
    domains: [
      'example.com',         // tes seeds
      'picsum.photos',       // tests
      'res.cloudinary.com',  // si tu utilises Cloudinary
      'images.unsplash.com', // si tu utilises Unsplash
      'localhost',
    ],
    // Patterns avancés (avec protocole/port)
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost', port: '5001' }, // images servies par ton backend
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
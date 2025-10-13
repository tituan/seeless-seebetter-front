// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ⚠️ ne plus utiliser experimental.typedRoutes
  typedRoutes: true,
  turbopack: {
    // force la racine du projet (évite le warning “inferred workspace root”)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
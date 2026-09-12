const basePath = process.env.BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  // Set BASE_PATH=/Passcodes-Website only when building for GitHub Pages.
  // Local builds (npm run build / npm run dev) get '' → everything works at /.
  basePath,
  assetPrefix: process.env.ASSET_PREFIX || '',

  env: {
    BASE_PATH: basePath,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },

  productionBrowserSourceMaps: true,
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@entropy-garden/engine', '@entropy-garden/ai'],
  experimental: {
    optimizePackageImports: ['zustand'],
  },
  // Disable standalone for Windows dev (symlink permission issues)
  // Re-enable for Docker deployment
  // output: 'standalone',
}

module.exports = nextConfig

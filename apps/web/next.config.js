/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@entropy-garden/engine', '@entropy-garden/ai'],
  experimental: {
    optimizePackageImports: ['zustand'],
  },
  // Enable standalone output for Docker
  output: 'standalone',
}

module.exports = nextConfig

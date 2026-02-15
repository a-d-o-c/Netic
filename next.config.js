/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.trademe.co.nz', 'images.trademe.co.nz'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

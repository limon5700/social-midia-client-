/** @type {import('next').NextConfig} */
const apiBase = process.env.API_URL || 'http://127.0.0.1:3001'

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }]
  },
}

module.exports = nextConfig 
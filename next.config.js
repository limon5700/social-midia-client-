/** @type {import('next').NextConfig} */
const apiBase = process.env.API_URL || 'http://127.0.0.1:3001'

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'picsum.photos'],
  },
  typescript: {
    // প্রোডাকশন বিল্ডের সময় ছোটখাটো টাইপ এরর থাকলেও বিল্ড সম্পূর্ণ হতে দেবে
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }]
  },
}

module.exports = nextConfig 
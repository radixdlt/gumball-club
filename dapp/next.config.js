const dns = require('dns')

dns.setDefaultResultOrder('ipv4first')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: [
      'image/avif',
      'image/webp',
      'image/png',
      'image/jpg',
      'image/jpeg',
      'image/svg+xml',
    ],
  },
}

module.exports = nextConfig

const dns = require('dns')

dns.setDefaultResultOrder('ipv4first')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig

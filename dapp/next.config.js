const dns = require('dns')

dns.setDefaultResultOrder('ipv4first')

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

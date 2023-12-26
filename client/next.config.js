/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'image.tmdb.org',
      'rb.gy',
      'example.com',
      'hotellerv5.b-cdn.net',
      'picsum.photos',
      'localhost',
      'a.slack-edge.com',
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
}

module.exports = nextConfig

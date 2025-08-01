/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['chommo.store', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chommo.store',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 중 Fast Refresh 개선
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Turbopack 설정 (Next.js 16+)
  turbopack: {},
};

module.exports = nextConfig;

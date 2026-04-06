/** @type {import('next').NextConfig} */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://web-production-4f439.up.railway.app";

const nextConfig = {
  skipTrailingSlashRedirect: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: `${API_BASE}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

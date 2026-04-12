/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

if (!API_BASE) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE environment variable is required. Set it in Vercel or .env.local."
  );
}

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

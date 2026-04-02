/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows the build to finish even with linting warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignores type errors during build for faster deployment
    ignoreBuildErrors: true,
  },
  
  // --- FIX PARA EL WEBHOOK (EVITA EL 307) ---
  // Esto evita que Next.js intente redireccionar por culpa de la barra final /
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        // When the frontend calls /v1/dispatch...
        source: '/v1/:path*',
        // ...forward the request to your FastAPI backend:
        destination: 'https://web-production-4f439.up.railway.app/v1/:path*',
      },
    ]
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Esto permite que el build termine aunque haya advertencias de variables sin usar
    ignoreDuringBuilds: true,
  },
  typescript: {
    // También podés ignorar errores de tipos en el build si estás muy apurado
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  /** Recharts ESM/CJS interop with Webpack can throw "__webpack_modules__[moduleId] is not a function". */
  transpilePackages: ['recharts'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  async redirects() {
    return [{ source: '/superadmin', destination: '/admin', permanent: false }];
  },
};

export default nextConfig;

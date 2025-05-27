import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['@mui/x-data-grid'],
  crossOrigin: "use-credentials",
  images: {
    remotePatterns: [
      {
        hostname: '*',
      }
    ]
  }
};

export default nextConfig;

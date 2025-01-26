import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_PATH: process.env.BASE_PATH,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.billerpay.id',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com'
      }
    ]
  },
};

export default nextConfig;

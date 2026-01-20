import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Enable static export if needed
  // output: 'export',
};

export default nextConfig;

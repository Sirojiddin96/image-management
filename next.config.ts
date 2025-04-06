import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_IS_DOCKER: process.env.NEXT_PUBLIC_IS_DOCKER,
  },
};

export default nextConfig;

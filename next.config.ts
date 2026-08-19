import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't guess wrong when a stray
  // lockfile exists in a parent directory (e.g. the user's home folder).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

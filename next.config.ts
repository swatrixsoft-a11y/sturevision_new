import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "pdf-parse"],
  },
};

export default nextConfig;

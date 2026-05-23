import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  serverExternalPackages: ["mongoose", "pdf-parse"],
};

export default nextConfig;

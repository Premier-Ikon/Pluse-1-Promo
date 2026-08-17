import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/andres-guzman.vcf",
        headers: [
          {
            key: "Content-Type",
            value: "text/vcard; charset=utf-8",
          },
          {
            key: "Content-Disposition",
            value: 'inline; filename="andres-guzman.vcf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

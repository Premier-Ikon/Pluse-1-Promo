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
    const vcardHeaders = (filename: string) => [
      {
        key: "Content-Type",
        value: "text/vcard; charset=utf-8",
      },
      {
        key: "Content-Disposition",
        value: `inline; filename="${filename}"`,
      },
    ];

    return [
      {
        source: "/andres-guzman.vcf",
        headers: vcardHeaders("andres-guzman.vcf"),
      },
      {
        source: "/dylan-guzman.vcf",
        headers: vcardHeaders("dylan-guzman.vcf"),
      },
    ];
  },
};

export default nextConfig;

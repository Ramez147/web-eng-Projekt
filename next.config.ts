import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/landing_page/components/about-us",
        permanent: false,
      },
      {
        source: "/kontakt",
        destination: "/landing_page/components/kontakt",
        permanent: false,
      },
      {
        source: "/team",
        destination: "/landing_page/components/team",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

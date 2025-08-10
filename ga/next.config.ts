import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gatcg.com",
        port: "",
        pathname: "/cards/images/**",
      },
    ],
  },
};

export default nextConfig;

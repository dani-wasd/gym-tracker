import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // TODO: Directly redirect to login if not signed in
  // TODO: Create a root page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        // De pagina "Doe mee" is hernoemd naar "Werken bij". Houd bestaande
        // links en zoekmachine-indexering intact met een permanente 301.
        source: "/ik-wil-helpen",
        destination: "/werken-bij",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;

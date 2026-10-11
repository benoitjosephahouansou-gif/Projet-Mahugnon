/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", ".prisma/client", "postgres"],
  },
};

module.exports = nextConfig;
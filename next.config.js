/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "standalone", // Ajoute cette ligne
  serverExternalPackages: ["@prisma/client", ".prisma/client", "postgres"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["ui", "shared"],
  experimental: {
    optimizePackageImports: ["ui"],
  },
}

module.exports = nextConfig
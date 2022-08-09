/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HOST: process.env.HOST,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, module: false, path: false };
    config.module.rules.push({
      issuer: {
        and: [/.(ts|tsx|js|jsx|md|mdx)$/],
      },
    });
    return config;
  },
  images: {
    domains: ['icon-library.com'],
  },

};

module.exports = nextConfig;

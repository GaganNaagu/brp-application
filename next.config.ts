/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ Skip type checking during build (not recommended for production)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Skip ESLint during build (not recommended for production)
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.fivemanage.com",
        port: "",
        pathname: "/BR7Q2n0nR3UkMtqZisSkc/*",
        search: "",
      },
    ],
  },
};

module.exports = nextConfig;

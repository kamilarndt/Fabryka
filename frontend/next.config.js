/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the workspace root to avoid lockfile warnings
  outputFileTracingRoot: require('path').join(__dirname, '../'),
  
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  // Exclude test files from build
  webpack: (config) => {
    config.module.rules.push({
      test: /\.test\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    
    // Optimize webpack cache performance
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };
    
    return config;
  },
};

module.exports = nextConfig;

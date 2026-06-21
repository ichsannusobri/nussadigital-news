/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  generateBuildId: async () => {
    // Force a fresh build every time to bypass Cloudflare's aggressive cache
    return Date.now().toString();
  },
};

module.exports = nextConfig;

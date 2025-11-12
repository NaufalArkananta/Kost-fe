/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "learn.smktelkom-mlg.sch.id",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

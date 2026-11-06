/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Product imagery is referenced by URL from Firestore, so optimisation is
    // handled at the source (Unsplash) instead of through the Next image proxy.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

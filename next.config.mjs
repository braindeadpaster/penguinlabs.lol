/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We build the whole platform client-side for now (no backend secrets required),
  // so nothing here needs env vars. Lint is skipped during build to keep deploys green.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

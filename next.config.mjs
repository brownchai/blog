/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['gray-matter', 'remark', 'remark-html', 'remark-gfm'],
  },
};

export default nextConfig;

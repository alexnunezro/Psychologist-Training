/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude native modules from client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'onnxruntime-node': false,
        'chromadb': false,
      }
    }
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ['chromadb', 'onnxruntime-node'],
  },
}

module.exports = nextConfig 
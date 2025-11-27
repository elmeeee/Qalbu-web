/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.islamic.network',
            },
            {
                protocol: 'https',
                hostname: 'api.quran.com',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
}

module.exports = nextConfig

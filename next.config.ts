/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '**',
      },
      {
        // ✅ Add this new block for AniList images
        protocol: 'https',
        hostname: 's4.anilist.co',
        port: '',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
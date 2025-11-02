import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ML Matters',
    short_name: 'ML Matters',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#00f5ff',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}


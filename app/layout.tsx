import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ML Matters | AI & Machine Learning Blog',
    template: '%s | ML Matters',
  },
  description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
  keywords: ['AI', 'machine learning', 'artificial intelligence', 'deep learning', 'technology', 'innovation', 'tech blog', 'ML', 'neural networks', 'data science', 'SDAD', 'blog', 'AI blog', 'ML blog'],
  authors: [{ name: 'SDAD', url: 'https://sdad.pro' }],
  creator: 'SDAD',
  publisher: 'SDAD',
  category: 'Technology',
  classification: 'Blog',
  alternates: {
    canonical: 'https://blog.sdad.pro',
    types: {
      'application/rss+xml': [{ url: 'https://blog.sdad.pro/feed.xml', title: 'ML Matters RSS Feed' }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.sdad.pro',
    siteName: 'ML Matters',
    title: 'ML Matters | AI & Machine Learning Blog',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    images: [
      {
        url: 'https://blog.sdad.pro/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ML Matters - AI & Machine Learning Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ML Matters | AI & Machine Learning Blog',
    description: 'AI and Machine Learning blog covering the latest technology trends, breakthroughs, and innovations in artificial intelligence, deep learning, and cutting-edge tech developments',
    creator: '@SDAD',
    images: ['https://blog.sdad.pro/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://blog.sdad.pro'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  verification: {
    // Add verification codes here when needed
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
      return (
        <html lang="en">
          <body className="relative z-10 font-terminal">
            <div className="relative z-10">
              {children}
            </div>
          </body>
        </html>
      )
}


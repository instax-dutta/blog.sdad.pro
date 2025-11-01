import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog | SDAD',
  description: 'A sci-fi themed blog covering technology, development, and innovation',
  keywords: ['blog', 'technology', 'development', 'sci-fi', 'tech'],
  authors: [{ name: 'SDAD' }],
  creator: 'SDAD',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.sdad.pro',
    title: 'Blog | SDAD',
    description: 'A sci-fi themed blog covering technology, development, and innovation',
    siteName: 'SDAD Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | SDAD',
    description: 'A sci-fi themed blog covering technology, development, and innovation',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative z-10">
        {children}
      </body>
    </html>
  )
}


import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

export const metadata: Metadata = {
  title: 'SocialConnect - Modern Social Media Platform',
  description: 'A modern, clean, and fully responsive social media website with real-time features',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-white text-gray-900 antialiased overflow-x-hidden max-w-[100vw]">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
} 
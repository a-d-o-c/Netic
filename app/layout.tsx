import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Netic - What you want, finds you',
  description: 'Post what you\'re looking for and let Netic find it for you. Automatic searching across Trade Me, Facebook Marketplace, and more.',
  keywords: 'marketplace, wanted, trade me, new zealand, shopping, search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500 text-sm">
              <p>🧲 Netic - What you want, finds you.</p>
              <p className="mt-2">Built with love in New Zealand</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

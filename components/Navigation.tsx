// @ts-nocheck
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                🧲 Netic
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/post" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/post') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Post Want
            </Link>
            <Link 
              href="/my-wants" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/my-wants') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              My Wants
            </Link>
            <Link 
              href="/browse" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/browse') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Browse Wants
            </Link>
            <Link 
              href="/how-it-works" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/how-it-works') 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              How It Works
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WantCard from '@/components/WantCard'

async function getRecentWants() {
  const { data, error } = await supabase
    .from('wants')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)
  
  if (error) {
    console.error('Error fetching wants:', error)
    return []
  }
  
  return data || []
}

export default async function HomePage() {
  const recentWants = await getRecentWants()
  
  return (
    <>
      {/* Hero Section */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              🧲 What you want, finds you.
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Post what you're looking for. Netic searches Trade Me and more, 
              then emails you when matches are found.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/post" 
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Post a Want
              </Link>
              <Link 
                href="/browse" 
                className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
              >
                Browse Wants
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How Netic Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Post Your Want</h3>
            <p className="text-gray-600">
              Tell us what you're looking for. Set your budget or mark it as "open to free/donation".
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. We Search For You</h3>
            <p className="text-gray-600">
              Netic automatically searches Trade Me, Facebook Marketplace, and more every hour.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Get Notified</h3>
            <p className="text-gray-600">
              When matches are found, we email you instantly with links and prices.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Wants */}
      {recentWants.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Recent Wants
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWants.map((want) => (
              <WantCard key={want.id} want={want} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/browse" 
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Wants →
            </Link>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-purple-600 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stop searching. Start finding.
            </h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Join Netic and let what you want find you.
            </p>
            <Link 
              href="/post" 
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition inline-block"
            >
              Post Your First Want
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

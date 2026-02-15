// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Database } from '@/types/database'

type Want = Database['public']['Tables']['wants']['Row'] & {
  match_count?: number
  offer_count?: number
}

export default function MyWantsPage() {
  const [wants, setWants] = useState<Want[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  async function loadWants(userEmail: string) {
    try {
      const response = await fetch(`/api/wants?email=${userEmail}`)
      if (response.ok) {
        const data = await response.json()
        
        // Get match and offer counts for each want
        const wantsWithCounts = await Promise.all(
          data.map(async (want: Want) => {
            const [matchesRes, offersRes] = await Promise.all([
              fetch(`/api/matches?want_id=${want.id}`),
              fetch(`/api/offers?want_id=${want.id}`)
            ])
            
            const matches = matchesRes.ok ? await matchesRes.json() : []
            const offers = offersRes.ok ? await offersRes.json() : []
            
            return {
              ...want,
              match_count: matches.length,
              offer_count: offers.length
            }
          })
        )
        
        setWants(wantsWithCounts)
        setEmailSubmitted(true)
      }
    } catch (error) {
      console.error('Error loading wants:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) {
      localStorage.setItem('netic_email', email)
      loadWants(email)
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('netic_email')
    if (savedEmail) {
      setEmail(savedEmail)
      loadWants(savedEmail)
    } else {
      setLoading(false)
    }
  }, [])

  async function handleSearchNow(wantId: string) {
    try {
      const response = await fetch(`/api/search/${wantId}`, { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        alert(`Found ${data.new_matches} new matches!`)
        // Reload wants
        loadWants(email)
      }
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  async function handleMarkFulfilled(wantId: string) {
    if (confirm('Mark this want as found/fulfilled?')) {
      try {
        const response = await fetch(`/api/wants/${wantId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'fulfilled' })
        })
        
        if (response.ok) {
          alert('Want marked as fulfilled!')
          loadWants(email)
        }
      } catch (error) {
        console.error('Error updating want:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Loading your wants...</p>
        </div>
      </div>
    )
  }

  if (!emailSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            View Your Wants
          </h1>
          <p className="text-gray-600 mb-6">
            Enter your email to see your posted wants and matches.
          </p>
          
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              View My Wants
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          My Wants
        </h1>
        <Link 
          href="/post" 
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          + Post New Want
        </Link>
      </div>
      
      {wants.length > 0 ? (
        <div className="space-y-6">
          {wants.map((want) => (
            <div key={want.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {want.title}
                      </h2>
                      {want.is_free && (
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                          Open to Free
                        </span>
                      )}
                    </div>
                    
                    {want.description && (
                      <p className="text-gray-600 mb-3">
                        {want.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>📍 {want.location}</span>
                      {!want.is_free && want.max_budget && (
                        <span>💰 Budget: ${want.max_budget}</span>
                      )}
                      <span>📅 Posted {new Date(want.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {want.match_count && want.match_count > 0 ? (
                      <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold mb-2">
                        {want.match_count} match{want.match_count !== 1 ? 'es' : ''} found
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">
                        No matches yet
                      </div>
                    )}
                    
                    {want.offer_count && want.offer_count > 0 && (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm mt-2">
                        💚 {want.offer_count} offer{want.offer_count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Link
                    href={`/want/${want.id}`}
                    className="flex-1 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-100 transition text-center"
                  >
                    View Details
                  </Link>
                  
                  <button 
                    onClick={() => handleSearchNow(want.id)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    🔍 Search Now
                  </button>
                  
                  <button 
                    onClick={() => handleMarkFulfilled(want.id)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    ✓ Mark Found
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🧲</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No wants posted yet
          </h2>
          <p className="text-gray-600 mb-8">
            Post what you're looking for and let Netic find it for you.
          </p>
          <Link 
            href="/post" 
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
          >
            Post Your First Want
          </Link>
        </div>
      )}
    </div>
  )
}

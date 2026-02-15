import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

async function getWant(id: string) {
  const { data, error } = await supabase
    .from('wants')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching want:', error)
    return null
  }
  
  return data
}

async function getMatches(wantId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('want_id', wantId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching matches:', error)
    return []
  }
  
  return data || []
}

async function getOffers(wantId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('want_id', wantId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching offers:', error)
    return []
  }
  
  return data || []
}

export default async function WantDetailPage({ params }: { params: { id: string } }) {
  const want = await getWant(params.id)
  
  if (!want) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Want not found</h1>
          <Link href="/browse" className="text-purple-600 hover:text-purple-700">
            ← Back to Browse
          </Link>
        </div>
      </div>
    )
  }
  
  const matches = await getMatches(params.id)
  const offers = await getOffers(params.id)
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Want Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {want.title}
            </h1>
            
            {want.description && (
              <p className="text-gray-700 text-lg mb-4">
                {want.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                📍 {want.location}
              </span>
              {!want.is_free && want.max_budget && (
                <span className="flex items-center">
                  💰 Budget: ${want.max_budget}
                </span>
              )}
              {want.is_free && (
                <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  💚 Open to free/donation
                </span>
              )}
              <span className="flex items-center">
                📅 Posted {new Date(want.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-6 border-t border-gray-100">
          <Link 
            href="/my-wants"
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            ← Back to My Wants
          </Link>
        </div>
      </div>
      
      {/* Matches Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Matches Found ({matches.length})
        </h2>
        
        {matches.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
                {match.image_url && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image 
                      src={match.image_url} 
                      alt={match.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {match.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>💰 ${match.price}</span>
                  <span>📍 {match.location}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{match.source.toUpperCase()}</span>
                  <span>{new Date(match.created_at).toLocaleDateString()}</span>
                </div>
                
                {match.url && (
                  <a 
                    href={match.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-purple-600 text-white text-center px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                  >
                    View Listing →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600">
              No matches found yet. Netic searches every hour automatically.
            </p>
          </div>
        )}
      </div>
      
      {/* Offers Section (if free/donation want) */}
      {want.is_free && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Direct Offers ({offers.length})
          </h2>
          
          {offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {offer.offerer_name} has this for you!
                      </h3>
                      <p className="text-sm text-gray-600">
                        📧 {offer.offerer_email}
                        {offer.offerer_phone && ` | 📱 ${offer.offerer_phone}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(offer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {offer.message && (
                    <p className="text-gray-700 bg-white p-4 rounded-lg mb-4">
                      "{offer.message}"
                    </p>
                  )}
                  
                  <a 
                    href={`mailto:${offer.offerer_email}?subject=Re: ${want.title}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition inline-block"
                  >
                    Contact Them
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-4xl mb-3">💚</div>
              <p className="text-gray-600">
                No direct offers yet. Your want is visible on the public board for charity shops and givers to see.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

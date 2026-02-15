'use client'

import Link from 'next/link'
import { Database } from '@/types/database'

type Want = Database['public']['Tables']['wants']['Row']

interface WantCardProps {
  want: Want & { match_count?: number; offer_count?: number }
  showActions?: boolean
}

export default function WantCard({ want, showActions = false }: WantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900 flex-1">
          {want.title}
        </h3>
        {want.is_free && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            Free
          </span>
        )}
      </div>
      
      {want.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {want.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>📍 {want.location}</span>
        {!want.is_free && want.max_budget && (
          <span>💰 ${want.max_budget}</span>
        )}
      </div>
      
      {showActions && (
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pt-3 border-t border-gray-100">
          <span>Posted {new Date(want.created_at).toLocaleDateString()}</span>
          {(want.match_count || want.offer_count) && (
            <div className="flex gap-2">
              {want.match_count ? (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                  {want.match_count} match{want.match_count !== 1 ? 'es' : ''}
                </span>
              ) : null}
              {want.offer_count ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {want.offer_count} offer{want.offer_count !== 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link 
          href={`/want/${want.id}`}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}

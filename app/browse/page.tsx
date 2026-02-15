// @ts-nocheck
import { supabase } from '@/lib/supabase'
import WantCard from '@/components/WantCard'

async function getAllWants() {
  const { data, error } = await supabase
    .from('wants')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching wants:', error)
    return []
  }
  
  return data || []
}

export default async function BrowseWantsPage() {
  const wants = await getAllWants()
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          People Want
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See what people in your community are looking for. 
          Have something they need? Make their day!
        </p>
      </div>
      
      {wants.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wants.map((want) => (
            <WantCard key={want.id} want={want} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🧲</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No active wants yet
          </h2>
          <p className="text-gray-600">
            Be the first to post what you're looking for!
          </p>
        </div>
      )}
    </div>
  )
}

// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PostWantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [budgetType, setBudgetType] = useState<'budget' | 'free'>('budget')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const wantData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      max_budget: budgetType === 'budget' ? parseFloat(formData.get('max_budget') as string) : null,
      location: formData.get('location') as string,
      contact_email: formData.get('contact_email') as string,
      contact_name: formData.get('contact_name') as string,
      is_free: budgetType === 'free',
      auto_search: true,
    }

    try {
      const response = await fetch('/api/wants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wantData),
      })

      if (response.ok) {
        router.push('/my-wants')
      } else {
        alert('Failed to post want. Please try again.')
      }
    } catch (error) {
      console.error('Error posting want:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Post a Want
        </h1>
        <p className="text-gray-600">
          Tell us what you're looking for and we'll find it for you.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              What are you looking for? *
            </label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              required
              placeholder="e.g., Golf driver Titleist G425"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Add details (optional)
            </label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Size, color, condition, specific requirements..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select 
              id="category" 
              name="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category...</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="baby">Baby & Kids</option>
              <option value="home">Home & Garden</option>
              <option value="collectibles">Collectibles & Antiques</option>
              <option value="tools">Tools & DIY</option>
              <option value="books">Books & Media</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget *
            </label>
            
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input 
                  type="radio" 
                  name="budget_type" 
                  value="budget" 
                  checked={budgetType === 'budget'}
                  onChange={() => setBudgetType('budget')}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">I have a budget</div>
                  <div className="text-sm text-gray-500">Maximum amount you're willing to pay</div>
                </div>
              </label>
              
              {budgetType === 'budget' && (
                <div className="ml-8">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <input 
                      type="number" 
                      name="max_budget" 
                      min="0"
                      step="0.01"
                      placeholder="150"
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              
              <label className="flex items-start cursor-pointer">
                <input 
                  type="radio" 
                  name="budget_type" 
                  value="free"
                  checked={budgetType === 'free'}
                  onChange={() => setBudgetType('free')}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Open to free/donation</div>
                  <div className="text-sm text-gray-500">
                    💚 Your want will be shown to charity shops and people giving things away
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Your location *
            </label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              required
              placeholder="e.g., Orewa, Auckland"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Helps find items near you for easy pickup
            </p>
          </div>
          
          {/* Contact Info */}
          <div>
            <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
              Your name (optional)
            </label>
            <input 
              type="text" 
              id="contact_name" 
              name="contact_name" 
              placeholder="How should people address you?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
              Email for alerts *
            </label>
            <input 
              type="email" 
              id="contact_email" 
              name="contact_email" 
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll email you when matches are found
            </p>
          </div>
          
          {/* Submit */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : '🧲 Post Want & Start Searching'}
            </button>
            
            <p className="mt-3 text-center text-sm text-gray-500">
              Netic will start searching immediately and email you when matches are found
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

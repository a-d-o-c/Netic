import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          How Netic Works
        </h1>
        <p className="text-xl text-gray-600">
          Stop searching. Start finding.
        </p>
      </div>
      
      {/* Steps */}
      <div className="space-y-16 mb-20">
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
            📝
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Post What You Want
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Tell us what you're looking for - could be a golf club, baby crib, vintage typewriter, anything. 
              Set your budget or mark it as "open to free/donation" if you're happy to receive it for free.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-1">Example:</p>
              <p className="text-gray-700">"Titleist golf driver, any condition, budget $150, Orewa"</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
            🔍
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. We Search For You
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Netic automatically searches every hour across:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span><strong>Trade Me</strong> - New Zealand's biggest marketplace</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span><strong>Facebook Marketplace</strong> (coming soon)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span><strong>Local sellers</strong> who see your want on our public board</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span><strong>Charity shops</strong> looking to match donations with needs</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
            📧
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Get Instant Notifications
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              When matches are found, we email you immediately with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Item title and description</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Current price</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Location</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Direct link to listing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="bg-purple-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Use Netic?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              ⏰ Save Time
            </h3>
            <p className="text-gray-600">
              No more checking Trade Me every hour. We do it for you automatically.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              🎯 Never Miss a Deal
            </h3>
            <p className="text-gray-600">
              Instant alerts mean you're first to see new listings.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              💚 Free & Charity Options
            </h3>
            <p className="text-gray-600">
              Open to donations? Charity shops and givers can find you.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              🔄 Multiple Sources
            </h3>
            <p className="text-gray-600">
              We search across platforms, not just one marketplace.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to find what you want?
        </h2>
        <p className="text-gray-600 mb-8">
          Post your first want and let Netic do the searching for you.
        </p>
        <Link 
          href="/post" 
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
        >
          🧲 Post a Want
        </Link>
      </div>
    </div>
  )
}

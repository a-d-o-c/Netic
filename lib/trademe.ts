// @ts-nocheck
interface TradeMeSearchResult {
  title: string
  price: number
  url: string
  location: string
  image_url: string
  listing_id: number
}

export class TradeMeSearcher {
  // Use public search endpoint (no auth needed for basic searches)
  private baseUrl = 'https://api.tmsandbox.co.nz/v1'
  
  async search(
    query: string,
    maxPrice?: number,
    maxResults: number = 20
  ): Promise<TradeMeSearchResult[]> {
    try {
      const params = new URLSearchParams({
        search_string: query,
        rows: maxResults.toString(),
      })
      
      if (maxPrice) {
        params.append('price_max', Math.floor(maxPrice).toString())
      }
      
      const url = `${this.baseUrl}/Search/General.json?${params}`
      
      console.log('Searching Trade Me (sandbox):', query)
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.error('Trade Me API error:', response.status, await response.text())
        return []
      }
      
      const data = await response.json()
      
      if (!data.List || data.List.length === 0) {
        console.log('No results from Trade Me')
        return []
      }
      
      console.log(`Found ${data.List.length} Trade Me results`)
      
      return data.List.map((item: any) => ({
        title: item.Title || 'Untitled',
        price: item.PriceDisplay?.Amount || item.BuyNowPrice || 0,
        url: `https://www.tmsandbox.co.nz/a/listing/${item.ListingId}`,
        location: item.Region || 'Unknown',
        image_url: item.PictureHref || '',
        listing_id: item.ListingId,
      }))
      
    } catch (error) {
      console.error('Error searching Trade Me:', error)
      return []
    }
  }
}

export const tradeMeSearcher = new TradeMeSearcher()
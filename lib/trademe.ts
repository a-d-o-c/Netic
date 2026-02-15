interface TradeMeSearchResult {
  title: string
  price: number
  url: string
  location: string
  image_url: string
  listing_id: number
}

export class TradeMeSearcher {
  private baseUrl = 'https://api.trademe.co.nz/v1'
  
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
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.error('Trade Me API error:', response.status, response.statusText)
        return []
      }
      
      const data = await response.json()
      
      if (!data.List || data.List.length === 0) {
        return []
      }
      
      return data.List.map((item: any) => ({
        title: item.Title || 'Untitled',
        price: item.PriceDisplay?.Amount || 0,
        url: this.buildListingUrl(item.ListingId, item.CategoryPath),
        location: item.Region || 'Unknown',
        image_url: item.PictureHref || '',
        listing_id: item.ListingId,
      }))
      
    } catch (error) {
      console.error('Error searching Trade Me:', error)
      return []
    }
  }
  
  private buildListingUrl(listingId: number, categoryPath?: string): string {
    if (!categoryPath) {
      return `https://www.trademe.co.nz/a/marketplace/${listingId}`
    }
    
    const cleanPath = categoryPath
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
    
    return `https://www.trademe.co.nz/a/marketplace/${cleanPath}/${listingId}`
  }
}

export const tradeMeSearcher = new TradeMeSearcher()

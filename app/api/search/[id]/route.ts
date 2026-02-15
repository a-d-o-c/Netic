import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { tradeMeSearcher } from '@/lib/trademe'
import { sendMatchNotification } from '@/lib/email/resend'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const wantId = params.id
    
    // Get the want
    const { data: want, error: wantError } = await supabase
      .from('wants')
      .select('*')
      .eq('id', wantId)
      .single()
    
    if (wantError || !want) {
      return NextResponse.json({ error: 'Want not found' }, { status: 404 })
    }
    
    // Build search query
    const searchQuery = `${want.title} ${want.description || ''}`.trim()
    
    // Search Trade Me
    const results = await tradeMeSearcher.search(
      searchQuery,
      want.max_budget || undefined,
      20
    )
    
    // Add matches to database
    let newMatches = 0
    const matchesToNotify = []
    
    for (const result of results) {
      const matchData = {
        want_id: wantId,
        source: 'trademe',
        title: result.title,
        price: result.price,
        url: result.url,
        location: result.location,
        image_url: result.image_url,
        notified: false,
      }
      
      // Check if already exists
      const { data: existing } = await supabase
        .from('matches')
        .select('id')
        .eq('want_id', wantId)
        .eq('url', result.url)
        .single()
      
      if (!existing) {
        const { data: newMatch, error } = await supabase
          .from('matches')
          .insert([matchData])
          .select()
          .single()
        
        if (!error && newMatch) {
          newMatches++
          matchesToNotify.push(newMatch)
        }
      }
    }
    
    // Send email notification if new matches found
    if (newMatches > 0 && want.contact_email) {
      await sendMatchNotification(
        want.contact_email,
        want.title,
        matchesToNotify.map(m => ({
          title: m.title,
          price: m.price,
          url: m.url,
          location: m.location,
          source: m.source,
        }))
      )
      
      // Mark matches as notified
      await supabase
        .from('matches')
        .update({ notified: true })
        .in('id', matchesToNotify.map(m => m.id))
    }
    
    return NextResponse.json({
      success: true,
      new_matches: newMatches,
      total_searched: results.length,
    })
    
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

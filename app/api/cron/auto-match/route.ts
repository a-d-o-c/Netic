import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { tradeMeSearcher } from '@/lib/trademe'
import { sendMatchNotification } from '@/lib/email/resend'

type Want = {
  id: string
  title: string
  description: string | null
  max_budget: number | null
  contact_email: string
  [key: string]: any
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🔍 Starting auto-matcher cron job...')
    
    // Get all active wants with auto_search enabled
    const { data, error: wantsError } = await supabase
      .from('wants')
      .select('*')
      .eq('status', 'active')
      .eq('auto_search', true)
    
    const wants = data as Want[] | null
    
    if (wantsError || !wants || wants.length === 0) {
      console.log('No active wants to search')
      return NextResponse.json({ 
        success: true, 
        message: 'No active wants' 
      })
    }
    
    console.log(`Found ${wants.length} active wants to search`)
    
    let totalNewMatches = 0
    const notifications: any[] = []
    
    // Search for each want
    for (const want of wants) {
      const searchQuery = `${want.title} ${want.description || ''}`.trim()
      
      console.log(`Searching for: ${want.title}`)
      
      // Search Trade Me
      const results = await tradeMeSearcher.search(
        searchQuery,
        want.max_budget || undefined,
        20
      )
      
      console.log(`  Found ${results.length} Trade Me results`)
      
      const newMatchesForWant = []
      
      // Add new matches to database
      for (const result of results) {
        const matchData = {
          want_id: want.id,
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
          .eq('want_id', want.id)
          .eq('url', result.url)
          .single()
        
        if (!existing) {
          const { data: newMatch, error } = await supabase
            .from('matches')
            .insert([matchData])
            .select()
            .single()
          
          if (!error && newMatch) {
            newMatchesForWant.push(newMatch)
            totalNewMatches++
          }
        }
      }
      
      // Queue email notification if new matches found
      if (newMatchesForWant.length > 0 && want.contact_email) {
        console.log(`  📧 Queueing email for ${newMatchesForWant.length} new matches`)
        notifications.push({
          email: want.contact_email,
          wantTitle: want.title,
          matches: newMatchesForWant,
        })
      }
    }
    
    // Send all email notifications
    console.log(`\n📧 Sending ${notifications.length} email notifications...`)
    
    for (const notification of notifications) {
      await sendMatchNotification(
        notification.email,
        notification.wantTitle,
        notification.matches.map((m: any) => ({
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
        .in('id', notification.matches.map((m: any) => m.id))
    }
    
    console.log(`\n✅ Cron job complete:`)
    console.log(`   - Searched ${wants.length} wants`)
    console.log(`   - Found ${totalNewMatches} new matches`)
    console.log(`   - Sent ${notifications.length} emails`)
    
    return NextResponse.json({
      success: true,
      wants_searched: wants.length,
      new_matches: totalNewMatches,
      emails_sent: notifications.length,
    })
    
  } catch (error) {
    console.error('❌ Cron job error:', error)
    return NextResponse.json({ 
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
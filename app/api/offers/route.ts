// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendOfferNotification } from '@/lib/email/resend'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wantId = searchParams.get('want_id')
    
    if (!wantId) {
      return NextResponse.json({ error: 'want_id required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('want_id', wantId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get the want to send notification
    const { data: want, error: wantError } = await supabase
      .from('wants')
      .select('*')
      .eq('id', body.want_id)
      .single()
    
    if (wantError || !want) {
      return NextResponse.json({ error: 'Want not found' }, { status: 404 })
    }
    
    // Create the offer
    const { data, error } = await supabase
      .from('offers')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Send email notification to the person who posted the want
    if (want.contact_email) {
      await sendOfferNotification(
        want.contact_email,
        want.title,
        body.offerer_name,
        body.offerer_email,
        body.message
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }
}

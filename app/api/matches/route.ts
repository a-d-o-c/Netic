import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wantId = searchParams.get('want_id')
    
    if (!wantId) {
      return NextResponse.json({ error: 'want_id required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('want_id', wantId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Check for duplicate
    const { data: existing } = await supabase
      .from('matches')
      .select('id')
      .eq('want_id', body.want_id)
      .eq('url', body.url)
      .single()
    
    if (existing) {
      return NextResponse.json({ message: 'Match already exists' }, { status: 200 })
    }
    
    const { data, error } = await supabase
      .from('matches')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}

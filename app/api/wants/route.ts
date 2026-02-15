// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('wants')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Trigger immediate search (will implement in Part 3)
    // await triggerSearch(data.id)
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating want:', error)
    return NextResponse.json({ error: 'Failed to create want' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status') || 'active'
    
    let query = supabase
      .from('wants')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (email) {
  query = query.ilike('contact_email', email)
}
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching wants:', error)
    return NextResponse.json({ error: 'Failed to fetch wants' }, { status: 500 })
  }
}

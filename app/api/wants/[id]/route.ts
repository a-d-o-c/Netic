import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const wantId = params.id
    
    const { data, error } = await supabase
      .from('wants')
      .update(body)
      .eq('id', wantId)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error updating want:', error)
    return NextResponse.json({ error: 'Failed to update want' }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { token } = await request.json()
  console.log('confirm-email hit with token:', token)

  const { data, error } = await supabase
    .from('email_confirmations')
    .select('*')
    .eq('token', token)
    .single()

  console.log('lookup result:', JSON.stringify(data), 'error:', JSON.stringify(error))

  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  if (data.confirmed_at) return NextResponse.json({ alreadyConfirmed: true })

  await supabase
    .from('email_confirmations')
    .update({ confirmed_at: new Date().toISOString() })
    .eq('token', token)

  await supabase
    .from('profiles')
    .update({ email_verified: true })
    .eq('id', data.user_id)

  return NextResponse.json({ success: true })
}
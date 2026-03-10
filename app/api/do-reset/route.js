import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { token, password } = await request.json()

  // Find token
  const { data, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 })
  if (data.used_at) return NextResponse.json({ error: 'This link has already been used' }, { status: 400 })

  // Check expiry (1 hour)
  const created = new Date(data.created_at)
  const now = new Date()
  if ((now - created) > 60 * 60 * 1000) {
    return NextResponse.json({ error: 'Reset link has expired, please request a new one' }, { status: 400 })
  }

  // Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(data.user_id, { password })
  if (updateError) return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })

  // Mark token as used
  await supabase.from('password_resets').update({ used_at: new Date().toISOString() }).eq('token', token)

  return NextResponse.json({ success: true })
}
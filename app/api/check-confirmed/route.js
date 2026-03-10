import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { email } = await request.json()

  // Get user id from auth
  const { data: authData, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ confirmed: false })

  const user = authData.users.find(u => u.email === email)
  if (!user) return NextResponse.json({ confirmed: false })

  // Check our own email_verified flag
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_verified')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ confirmed: !!profile?.email_verified })
}
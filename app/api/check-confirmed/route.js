import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { email } = await request.json()
  console.log('check-confirmed for:', email)

  const { data: authData, error } = await supabase.auth.admin.listUsers()
  if (error) { console.log('auth error:', error); return NextResponse.json({ confirmed: false }) }

  const user = authData.users.find(u => u.email === email)
  console.log('user found:', user?.id)

  if (!user) return NextResponse.json({ confirmed: false })

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email_verified')
    .eq('id', user.id)
    .single()

  console.log('profile:', JSON.stringify(profile), 'error:', JSON.stringify(profileError))

  return NextResponse.json({ confirmed: !!profile?.email_verified })
}
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { email } = await request.json()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ confirmed: false })
  
  const user = data.users.find(u => u.email === email)
  if (!user) return NextResponse.json({ confirmed: false })
  
  return NextResponse.json({ confirmed: !!user.email_confirmed_at })
}
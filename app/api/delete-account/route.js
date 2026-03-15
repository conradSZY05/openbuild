import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { userId } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // ddel profile (auth user deletion will cascade via ON DELETE SET NULL on projects)
  await supabase.from('profiles').delete().eq('id', userId)

  // delete the auth user using the service role key
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.log('delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

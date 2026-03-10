import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { email } = await request.json()

  // Find user
  const { data: authData } = await supabase.auth.admin.listUsers()
  const user = authData?.users.find(u => u.email === email)
  if (!user) return NextResponse.json({ success: true }) // Don't reveal if email exists

  // Generate token
  const array = new Uint8Array(32)
  globalThis.crypto.getRandomValues(array)
  const token = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')

  // Save token
  await supabase.from('password_resets').insert({ user_id: user.id, token })

  // Send email
  const resetUrl = `https://www.openbuild.net/reset-password?token=${token}`
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'OpenBuild <contact@openbuild.net>',
      to: email,
      subject: 'Reset your OpenBuild password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2c4a7c;">Reset your password</h2>
          <p>Click the link below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2c4a7c; color: white; padding: 12px 24px; text-decoration: none; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
        </div>
      `
    })
  })

  return NextResponse.json({ success: true })
}
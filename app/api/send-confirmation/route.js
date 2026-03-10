import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { userId, email } = await request.json()

  // Generate token
  const token = crypto.randomBytes(32).toString('hex')

  // Save token
  const { error: tokenError } = await supabase
    .from('email_confirmations')
    .insert({ user_id: userId, token })

  if (tokenError) return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })

  // Send email via Resend
  const confirmUrl = `https://www.openbuild.net/confirm?token=${token}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'OpenBuild <contact@openbuild.net>',
      to: email,
      subject: 'Confirm your OpenBuild account',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2c4a7c;">Welcome to OpenBuild</h2>
          <p>Click the link below to confirm your university email and activate your account.</p>
          <a href="${confirmUrl}" style="display: inline-block; background: #2c4a7c; color: white; padding: 12px 24px; text-decoration: none; margin: 16px 0;">
            Confirm Email
          </a>
          <p style="color: #999; font-size: 12px;">If you didn't sign up for OpenBuild, ignore this email.</p>
        </div>
      `
    })
  })

  if (!res.ok) return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })

  return NextResponse.json({ success: true })
}
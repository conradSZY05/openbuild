import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { isUniversityEmail } from '../../lib/universityEmail' 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { userId, email } = await request.json()
  console.log('isUniversityEmail type:', typeof isUniversityEmail)
  if (!isUniversityEmail(email)) {                                     
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 }) 
  }     

  console.log('send-confirmation hit for:', email, userId)

  const array = new Uint8Array(32)
  globalThis.crypto.getRandomValues(array)
  const token = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')

  const { error: tokenError } = await supabase
    .from('email_confirmations')
    .insert({ user_id: userId, token })

  if (tokenError) {
    console.log('token insert error:', JSON.stringify(tokenError))
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }

  console.log('token inserted, sending email...')

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
        <p>Thanks for signing up to OpenBuild.</p>
        <p>Please confirm your email address by clicking the link below:</p>
        <p><a href="https://www.openbuild.net/confirm?token=${token}">Confirm your email</a></p>
        <p>If you didn't sign up, you can ignore this email.</p>
        <p>— The OpenBuild Team</p>
      `
    })
  })

  console.log('resend status:', res.status)
  if (!res.ok) {
    const resendError = await res.text()
    console.log('resend error:', resendError)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
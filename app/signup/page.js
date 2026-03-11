'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

import { isUniversityEmail } from '../lib/universityEmail'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (!isUniversityEmail(email)) {
      setError('You must use a university email address. If yours is not recognised, contact us at contact@openbuild.net')
      return
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: data.user.id, email })
    })
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-stone-300 flex flex-col items-center justify-center px-4">
        <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Check your email</h2>
          <p className="text-stone-500 mb-2">We sent a confirmation link to <strong>{email}</strong></p>
          <p className="text-xs text-stone-400 mb-4">Email not arriving? Check your spam folder, or email <a href="mailto:contact@openbuild.net" className="underline" style={{ color: '#2c4a7c' }}>contact@openbuild.net</a> and we'll confirm your account within 24 hours.</p>
          <a href="/login" className="text-sm underline" style={{ color: '#2c4a7c' }}>Back to login</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-300 flex flex-col items-center justify-center px-4">
      <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full">
        <a href="/projects" className="hover:opacity-70 block mb-6">
          <img src="/logo.png" alt="OpenBuild" className="h-10 w-auto" />
        </a>
        <h2 className="text-2xl font-bold text-stone-800 mb-1">Join OpenBuild</h2>
        <p className="text-stone-500 mb-6 text-sm">University email required</p>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="your@university.ac.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="text-white py-2 font-medium"
            style={{ backgroundColor: '#2c4a7c' }}
            onMouseOver={e => e.target.style.backgroundColor = '#1e3560'}
            onMouseOut={e => e.target.style.backgroundColor = '#2c4a7c'}
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-stone-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="underline" style={{ color: '#2c4a7c' }}>Log in</a>
        </p>
        <p className="text-xs text-stone-400 mt-3">
          University not recognised?{' '}
          <a href="mailto:contact@openbuild.net" className="underline" style={{ color: '#2c4a7c' }}>Contact us</a>
        </p>
      </div>
    </main>
  )
}
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/projects'
    }
  }

  return (
    <main className="min-h-screen bg-stone-300 flex flex-col items-center justify-center px-4">
      <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-stone-800 mb-1">Welcome back</h2>
        <p className="text-stone-500 mb-6 text-sm">Log in to OpenBuild</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            Log In
          </button>
        </form>

        <p className="text-sm text-stone-500 mt-4">
          Don't have an account?{' '}
          <a href="/signup" className="underline" style={{ color: '#2c4a7c' }}>Sign up</a>
        </p>
      </div>
    </main>
  )
}
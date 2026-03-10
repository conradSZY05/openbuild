'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check for error in URL hash
    const hash = window.location.hash
    if (hash.includes('error=access_denied')) {
      setError('Reset link has expired. Please request a new one.')
      return
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => window.location.href = '/projects', 2000)
    }
  }

  return (
    <main className="min-h-screen bg-stone-300 flex flex-col items-center justify-center px-4">
      <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-stone-800 mb-1">New Password</h2>
        <p className="text-stone-500 mb-6 text-sm">Choose a new password for your account</p>
        {done ? (
          <p className="text-green-600 text-sm">Password updated! Redirecting...</p>
        ) : error ? (
          <>
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <a href="/login" className="text-sm underline" style={{ color: '#2c4a7c' }}>← Back to login</a>
          </>
        ) : !ready ? (
          <p className="text-stone-500 text-sm">Verifying reset link...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            ...
          </form>
        ) (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New password"
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
              Update Password
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
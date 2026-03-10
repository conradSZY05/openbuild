'use client'
import { useState, useEffect } from 'react'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState(null)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (!t) setError('Invalid reset link')
    else setToken(t)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/do-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setDone(true)
      setTimeout(() => window.location.href = '/login', 2000)
    }
  }

  return (
    <main className="min-h-screen bg-stone-300 flex flex-col items-center justify-center px-4">
      <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-stone-800 mb-1">New Password</h2>
        <p className="text-stone-500 mb-6 text-sm">Choose a new password for your account</p>
        {done ? (
          <p className="text-green-600 text-sm">Password updated! Redirecting to login...</p>
        ) : error && !token ? (
          <>
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <a href="/login" className="text-sm underline" style={{ color: '#2c4a7c' }}>← Back to login</a>
          </>
        ) : (
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
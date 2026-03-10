'use client'
import { useEffect, useState } from 'react'

export default function Confirm() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) { setStatus('invalid'); return }

    fetch('/api/confirm-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success || data.alreadyConfirmed) setStatus('success')
        else setStatus('invalid')
      })
      .catch(() => setStatus('invalid'))
  }, [])

  return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center px-4">
      <div className="bg-stone-200 border border-stone-400 p-8 max-w-md w-full text-center">
        <a href="/projects" className="text-2xl font-bold text-stone-800 hover:opacity-70 block mb-6">
          OpenBuild
        </a>
        {status === 'loading' && <p className="text-stone-500">Confirming your email...</p>}
        {status === 'success' && (
          <>
            <p className="text-green-600 font-medium mb-2">Email confirmed!</p>
            <p className="text-stone-500 text-sm mb-4">Your account is now active.</p>
            <a href="/login" className="text-white px-6 py-2 font-medium inline-block"
              style={{ backgroundColor: '#2c4a7c' }}>
              Log In
            </a>
          </>
        )}
        {status === 'invalid' && (
          <>
            <p className="text-red-500 font-medium mb-2">Invalid or expired link</p>
            <p className="text-stone-500 text-sm">Try signing up again.</p>
          </>
        )}
      </div>
    </main>
  )
}
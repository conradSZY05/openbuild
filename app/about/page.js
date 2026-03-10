'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function About() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
    <div className="flex-1 md:mr-72">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2 border-b border-stone-400 pb-3">
        <div className="flex items-center gap-4">
            <a href="/projects" className="hover:opacity-70">
            <img src="/logo.png" alt="OpenBuild" className="h-14 md:h-16 w-auto -mt-8 md:-mt-5" />
            </a>
            <div className="flex items-center gap-2 md:gap-6">
            <a href="/projects" className="text-xs md:text-sm font-medium text-stone-700 underline hover:opacity-70">Projects</a>
            <a href="/about" className="text-xs md:text-sm font-medium text-stone-700 underline hover:opacity-70">About</a>
            <span className="text-xs md:text-sm text-stone-400">Networking <span className="text-xs">(coming soon)</span></span>
            </div>
        </div>
        <div className="flex gap-2 items-center">
            {user ? (
            <>
                <a href="/profile" className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100">My Profile</a>
                <button
                onClick={async () => { await supabase.auth.signOut(); window.location.href = '/projects' }}
                className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100"
                >Log Out</button>
            </>
            ) : (
            <a href="/login" className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100">Log In</a>
            )}
            <a
            href="/post"
            className="text-white px-3 py-1 text-sm"
            style={{ backgroundColor: '#2c4a7c' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#1e3560' }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#2c4a7c' }}
            >+ Post Project</a>
        </div>
        </div>

        {/* Content — unchanged */}
        ...

    </div>

    {/* Right sidebar — desktop only */}
    <div className="hidden md:block fixed top-0 right-0 h-full bg-stone-200 border-l border-stone-400 p-4" style={{ width: '260px' }}>
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-3">Societies and Events</p>
        <div className="bg-stone-300 border border-stone-400 p-3 text-xs text-stone-500 text-center">Your ad here</div>
    </div>

    <div className="text-xs text-stone-400 text-center py-4 mt-8 md:mr-72">
        ...footer...
    </div>
    </main>
  )
}
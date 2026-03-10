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
      <div style={{ marginRight: '280px' }} className="flex-1">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-6">
            <a href="/projects" className="hover:opacity-70">
              <img src="/logo.png" alt="OpenBuild" style={{ height: '75px', marginTop: '-20px' }} />
            </a>
            <a href="/projects" className="text-sm font-large text-stone-700 hover:underline">Projects</a>
            <a href="/about" className="text-sm font-large text-stone-700 hover:underline">About</a>
            <span className="text-sm font-large text-stone-400">Networking <span className="text-xs">(coming soon)</span></span>
          </div>
          <div className="flex gap-2 items-center">
            {user ? (
              <>
                <a href="/profile" className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100">
                  My Profile
                </a>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/projects' }}
                  className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100"
                >
                  Log Out
                </button>
              </>
            ) : (
              <a href="/login" className="bg-stone-200 border border-stone-400 text-stone-700 px-3 py-1 text-sm hover:bg-stone-100">
                Log In
              </a>
            )}
            <a
              href="/post"
              className="text-white px-3 py-1 text-sm"
              style={{ backgroundColor: '#2c4a7c' }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#1e3560' }}
              onMouseOut={(e) => { e.target.style.backgroundColor = '#2c4a7c' }}
            >
              + Post Project
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="bg-stone-200 border border-stone-400 p-8">
          <h1 className="text-2xl font-bold text-stone-800 mb-6">About OpenBuild</h1>
          <div className="flex flex-col gap-6 text-sm text-stone-700 leading-relaxed">

            <div>
              <h2 className="font-bold text-stone-800 mb-2">What is OpenBuild?</h2>
              <p>OpenBuild is a platform for university students to find collaborators for side projects, hackathons, startups, coursework and more, as well as being a place for students to network and find exciting project inspiration. Post what you're building, say what skills you're looking for, and connect with students across the UK and beyond.</p>
            </div>

            <div>
              <h2 className="font-bold text-stone-800 mb-2">Why was it built?</h2>
              <p>As an Electronic Engineering student at Manchester, I kept having ideas for projects but no easy way to find people with the right skills to build them with. Universities have thousands of talented students - engineers, designers, developers, scientists - but no central place to connect around projects. OpenBuild is my attempt to fix that.</p>
            </div>

            <div>
              <h2 className="font-bold text-stone-800 mb-2">Who is it for?</h2>
              <p>Any university student with a university email. Whether you have a project idea and need collaborators, you have skills and want to get involved in something interesting, or maybe you just want to show off your projects and network with like-minded students, - OpenBuild is for you.</p>
            </div>

            <div className="border-t border-stone-300 pt-6">
              <h2 className="font-bold text-stone-800 mb-2">Built by</h2>
              <p className="mb-2">Conrad Szyman — Electronic Engineering student at the University of Manchester.</p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/conrad-szyman-aaa159233/"
                  target="_blank"
                  className="text-sm underline"
                  style={{ color: '#2c4a7c' }}
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:contact@openbuild.net"
                  className="text-sm underline"
                  style={{ color: '#2c4a7c' }}
                >
                  contact@openbuild.net
                </a>
              </div>

            <div className="border-t border-stone-300 pt-6 flex justify-center">
            <img src="/logo-pure.png" alt="OpenBuild" style={{ height: '150px', opacity: 0.4 }} />
            </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right sidebar */}
      <div
        className="fixed top-0 right-0 h-full bg-stone-200 border-l border-stone-400 p-4"
        style={{ width: '260px' }}
      >
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-3">Societies and Events</p>
        <div className="bg-stone-300 border border-stone-400 p-3 text-xs text-stone-500 text-center">
          Your ad here
        </div>
      </div>

      <div className="text-xs text-stone-400 text-center py-4 mt-8" style={{ marginRight: '280px' }}>
        <a href="/privacy" className="hover:underline" style={{ color: '#2c4a7c' }}>Privacy Policy</a>
        {' · '}
        <a href="/terms" className="hover:underline" style={{ color: '#2c4a7c' }}>Terms of Service</a>
        {' · '}
        <span>contact@openbuild.net</span>
        {' · '}
        <span>© {new Date().getFullYear()} OpenBuild</span>
      </div>
    </main>
  )
}
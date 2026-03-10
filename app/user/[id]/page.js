'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../lib/supabase'

export default function UserProfile({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasVoted, setHasVoted] = useState(false)
  const [repping, setRepping] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()
      setProfile(profile)

      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', params.id)
        .order('created_at', { ascending: false })
      setProjects(projects || [])

      if (user) {
        const { data: vote } = await supabase
          .from('reputation_votes')
          .select('id')
          .eq('from_user_id', user.id)
          .eq('to_user_id', params.id)
          .single()
        setHasVoted(!!vote)
      }

      setLoading(false)
    }
    fetchData()
  }, [params.id])

    const handleRep = async () => {
    if (!user || hasVoted || user.id === params.id) return
    setRepping(true)

    const { error: voteError } = await supabase
        .from('reputation_votes')
        .insert({ from_user_id: user.id, to_user_id: params.id })

    if (!voteError) {
        const { data: fresh } = await supabase
        .from('profiles')
        .select('reputation')
        .eq('id', params.id)
        .single()

        const newRep = (fresh?.reputation || 0) + 1

        await supabase
        .from('profiles')
        .update({ reputation: newRep })
        .eq('id', params.id)

        setProfile(p => ({ ...p, reputation: newRep }))
        setHasVoted(true)
    }
    setRepping(false)
    }

  const getAvatar = () => {
    if (profile?.avatar_url) return profile.avatar_url
    return `/default-avatar.jpg`
  }

    const getDisplayName = (profile) => {
    if (!profile) return loading ? '...' : 'Deleted User'
    if (!user || profile.anonymous) return `${(profile.display_name || '?')[0]}...`
    return profile.display_name || 'Member'
    }

  if (loading) return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center">
      <p className="text-stone-500">Loading...</p>
    </main>
  )

  if (!profile) return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center">
      <p className="text-stone-500">User not found.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
    <div style={{ marginRight: '40px' }} className="flex-1">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <a href="/projects" className="hover:opacity-70">
            <img src="/logo.png" alt="OpenBuild" style={{ height: '32px' }} />
          </a>
          <a href="/projects" className="text-sm underline" style={{ color: '#2c4a7c' }}>← Back to projects</a>
        </div>

        <div className="flex gap-4 items-start w-full">

          {/* Left — profile card */}
          <div className="bg-stone-200 border border-stone-400 p-4 flex flex-col items-center text-center" style={{ width: '200px', minWidth: '200px' }}>
            <img
              src={getAvatar()}
              alt="avatar"
              style={{ display: 'block', width: '100px', height: '100px', objectFit: 'cover' }}
              className="border border-stone-400 mb-3"
            />
            <p className="font-bold text-stone-800 text-sm break-all">{getDisplayName(profile)}</p>

            {profile.university && <p className="text-xs text-stone-500 mt-1">{profile.university}</p>}
            {(profile.degree || profile.course) && (
              <p className="text-xs text-stone-500">{[profile.degree, profile.course].filter(Boolean).join(' — ')}</p>
            )}
            {profile.graduation_year && <p className="text-xs text-stone-400">Graduating {profile.graduation_year}</p>}

            {profile.skills && (
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {profile.skills.split(',').map((s, i) => (
                  <span key={i} className="text-white text-xs px-2 py-0.5" style={{ backgroundColor: '#2c4a7c' }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-stone-300 w-full">
              <p className="text-xs text-stone-500 uppercase tracking-wide">Reputation</p>
              <p className="text-2xl font-bold" style={{ color: '#2c4a7c' }}>{profile.reputation || 0}</p>
            </div>

            {/* Rep button */}
            {user && user.id !== params.id && (
              <button
                onClick={handleRep}
                disabled={hasVoted || repping}
                className="mt-3 w-full py-2 text-sm font-medium"
                style={{
                  backgroundColor: hasVoted ? '#d6d3d1' : '#2c4a7c',
                  color: hasVoted ? '#78716c' : 'white',
                  cursor: hasVoted ? 'not-allowed' : 'pointer'
                }}
              >
                {hasVoted ? '✓ Repped' : '+ Give Rep'}
              </button>
            )}
            {user && user.id === params.id && (
              <p className="text-xs text-stone-400 mt-3 italic">This is your profile</p>
            )}
            {!user && (
              <a href="/login" className="mt-3 text-xs underline" style={{ color: '#2c4a7c' }}>
                Log in to give rep
              </a>
            )}

            <p className="text-xs text-stone-400 mt-3 border-t border-stone-300 pt-3 w-full">
              Member since {new Date(profile.created_at).toLocaleDateString('en-GB')}
            </p>
          </div>

          {/* Right — their projects */}
            <div className="flex-1 min-w-0">

            {/* Column headers */}
            <div className="flex text-white text-sm" style={{ backgroundColor: '#2c4a7c' }}>
                <div className="px-4 py-2 font-semibold flex-1">{getDisplayName(profile)}'s Projects</div>
                <div className="px-4 py-2 font-semibold w-44" style={{ borderLeft: '2px solid #1e3560' }}>Skills</div>
                <div className="px-4 py-2 font-semibold w-28" style={{ borderLeft: '2px solid #1e3560' }}>Posted</div>
            </div>

            {projects.length === 0 && (
                <div className="bg-stone-200 border border-stone-400 px-4 py-6 text-stone-500 text-sm text-center">
                No projects posted yet.
                </div>
            )}

            {projects.map((project, index) => (
                <div
                key={project.id}
                className="flex border-b border-stone-400 cursor-pointer hover:brightness-95"
                style={{ backgroundColor: index % 2 === 0 ? '#e7e5e4' : '#d6d3d1' }}
                onClick={() => window.location.href = `/projects/${project.id}`}
                >
                <div className="flex-1 px-4 py-3">
                    <p className="font-semibold text-sm hover:underline" style={{ color: '#2c4a7c' }}>
                    {project.title}
                    </p>
                    <p className="text-sm text-stone-600 mt-1 line-clamp-2">{project.description}</p>
                </div>
                <div className="px-4 py-3 text-sm text-stone-600 w-44 border-l border-stone-400">
                    {project.skills || '—'}
                </div>
                <div className="px-4 py-3 text-xs text-stone-700 font-medium w-28 border-l border-stone-400">
                    {new Date(project.created_at).toLocaleDateString('en-GB')}
                </div>
                </div>
            ))}

            </div>

        </div>
      </div>

        <div className="text-xs text-stone-400 text-center py-4">
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
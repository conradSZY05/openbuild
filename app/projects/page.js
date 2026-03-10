'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProjects(data)
        const userIds = [...new Set(data.map(p => p.user_id).filter(Boolean))]
        if (userIds.length > 0) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds)
          const profileMap = {}
          profileData?.forEach(p => { profileMap[p.id] = p })
          setProfiles(profileMap)
        }
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  const allSkills = [...new Set(
    projects.flatMap(p => p.skills ? p.skills.split(',').map(s => s.trim()) : [])
  )]

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchesSkill = skillFilter === '' || (p.skills && p.skills.toLowerCase().includes(skillFilter.toLowerCase()))
    return matchesSearch && matchesSkill
  })

  const getAvatar = (userId, avatarUrl) => avatarUrl || '/default-avatar.jpg'

  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
      <div className="flex-1 md:mr-72">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-4">
            <a href="/projects" className="hover:opacity-70">
              <img src="/logo.png" alt="OpenBuild" style={{ height: '69px', marginTop: '-20px' }} />
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/projects" className="text-sm font-medium text-stone-700 hover:underline">Projects</a>
              <a href="/about" className="text-sm font-medium text-stone-700 hover:underline">About</a>
              <span className="text-sm text-stone-400">Networking <span className="text-xs">(coming soon)</span></span>
            </div>
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

        {/* Search and filter bar */}
        <div className="flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-stone-400 px-3 py-1 text-sm text-stone-800 bg-stone-100 focus:outline-none w-full md:w-64"
          />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="border border-stone-400 px-3 py-1 text-sm text-stone-800 bg-stone-100 focus:outline-none"
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          {(search || skillFilter) && (
            <button onClick={() => { setSearch(''); setSkillFilter('') }} className="text-sm underline" style={{ color: '#2c4a7c' }}>
              Clear
            </button>
          )}
        </div>

        {/* Project list */}
        <div className="flex flex-col">
          {loading && (
            <div className="bg-stone-200 border border-stone-400 px-4 py-6 text-stone-500 text-sm text-center">Loading...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="bg-stone-200 border border-stone-400 px-4 py-6 text-stone-500 text-sm text-center">
              {projects.length === 0 ? 'No projects yet — be the first to post one!' : 'No projects match your search.'}
            </div>
          )}

          {/* Column headers — desktop only */}
          {filtered.length > 0 && (
            <div className="hidden md:flex text-white text-sm" style={{ backgroundColor: '#2c4a7c' }}>
              <div className="px-4 py-2 font-semibold" style={{ width: '160px', minWidth: '160px' }}>Posted By</div>
              <div className="px-4 py-2 font-semibold flex-1" style={{ borderLeft: '2px solid #1e3560' }}>Project</div>
              <div className="px-4 py-2 font-semibold w-44" style={{ borderLeft: '2px solid #1e3560' }}>Looking For</div>
              <div className="px-4 py-2 font-semibold w-28" style={{ borderLeft: '2px solid #1e3560' }}>Posted</div>
            </div>
          )}

          {filtered.map((project, index) => {
            const profile = profiles[project.user_id]
            const displayName = !project.user_id
              ? 'Deleted User'
              : (!user || profile?.anonymous)
                ? `${(profile?.display_name || '?')[0]}...`
                : profile?.display_name || 'Member'

            return (
              <div
                key={project.id}
                className="border-b border-stone-400 cursor-pointer hover:brightness-95"
                style={{ backgroundColor: index % 2 === 0 ? '#e7e5e4' : '#d6d3d1' }}
                onClick={() => window.location.href = `/projects/${project.id}`}
              >
                {/* Desktop layout */}
                <div className="hidden md:flex">
                  <div
                    className="flex flex-col items-center justify-start text-center p-3 border-r border-stone-400"
                    style={{ width: '160px', minWidth: '160px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={getAvatar(project.user_id, profile?.avatar_url)}
                      alt="avatar"
                      className="border border-stone-400 mb-2"
                      style={{ display: 'block', width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <p className="text-xs font-bold text-stone-700">{displayName}</p>
                    {profile?.university && <p className="text-xs text-stone-500 mt-1 leading-tight">{profile.university}</p>}
                    {profile?.course && <p className="text-xs text-stone-400 leading-tight">{profile.course}</p>}
                    <p className="text-xs text-stone-500 mt-1">Rep: <span className="font-bold" style={{ color: '#2c4a7c' }}>{profile?.reputation || 0}</span></p>
                  </div>
                  <div className="px-4 py-3 border-l border-stone-400" style={{ minWidth: 0, flex: 1 }}>
                    <p className="font-semibold text-base hover:underline" style={{ color: '#2c4a7c' }}>{project.title}</p>
                    <p className="text-sm text-stone-600 mt-1" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                      {project.description}
                    </p>
                  </div>
                  <div className="px-4 py-3 text-sm text-stone-600 w-44 border-l border-stone-400">{project.skills || '—'}</div>
                  <div className="px-4 py-3 text-xs text-stone-700 font-medium w-28 border-l border-stone-400">
                    {new Date(project.created_at).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {/* Mobile layout — card style */}
                <div className="md:hidden p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={getAvatar(project.user_id, profile?.avatar_url)}
                      alt="avatar"
                      className="border border-stone-400"
                      style={{ width: '36px', height: '36px', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-700">{displayName}</p>
                      {profile?.university && <p className="text-xs text-stone-400">{profile.university}</p>}
                    </div>
                    <p className="text-xs text-stone-400 ml-auto">{new Date(project.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#2c4a7c' }}>{project.title}</p>
                  <p className="text-xs text-stone-600 mb-2" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {project.description}
                  </p>
                  {project.skills && (
                    <p className="text-xs text-stone-500">Looking for: {project.skills}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right sidebar — desktop only */}
      <div className="hidden md:block fixed top-0 right-0 h-full bg-stone-200 border-l border-stone-400 p-4" style={{ width: '260px' }}>
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-3">Societies and Events</p>
        <div className="bg-stone-300 border border-stone-400 p-3 text-xs text-stone-500 text-center">Your ad here</div>
      </div>

      <div className="text-xs text-stone-400 text-center py-4 mt-8 md:mr-72">
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
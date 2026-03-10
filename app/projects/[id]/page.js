'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { supabase } from '../../lib/supabase'

export default function ProjectPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [project, setProject] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [zoomedImage, setZoomedImage] = useState(null)
  const [comments, setComments] = useState([])
  const [commentProfiles, setCommentProfiles] = useState({})
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setProject(data)
        if (data.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user_id)
            .single()
          setProfile(profileData)
        }
      }

      // fetch comments
      const { data: commentData } = await supabase
        .from('comments')
        .select('*')
        .eq('project_id', params.id)
        .order('created_at', { ascending: true })

      if (commentData) {
        setComments(commentData)
        const userIds = [...new Set(commentData.map(c => c.user_id).filter(Boolean))]
        if (userIds.length > 0) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds)
          const map = {}
          profileData?.forEach(p => { map[p.id] = p })
          setCommentProfiles(map)
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [params.id])

  const getAvatar = (avatarUrl, userId) => {
    if (avatarUrl) return avatarUrl
    return '/default-avatar.jpg'
  }

  const getDisplayName = (p) => {
    if (!p) return loading ? '...' : 'Deleted User'
    if (!user || p.anonymous) return `${(p.display_name || '?')[0]}...`
    return p.display_name || 'Member'
  }

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await supabase.from('projects').delete().eq('id', project.id)
    window.location.href = '/projects'
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    setSubmittingComment(true)

    const { data, error } = await supabase
      .from('comments')
      .insert({ project_id: params.id, user_id: user.id, content: newComment.trim() })
      .select()
      .single()

    if (!error && data) {
      setComments(prev => [...prev, data])
      // add own profile to map if not there
      if (!commentProfiles[user.id]) {
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (myProfile) setCommentProfiles(prev => ({ ...prev, [user.id]: myProfile }))
      }
      setNewComment('')
    }
    setSubmittingComment(false)
  }

  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  if (loading) return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center">
      <p className="text-stone-500">Loading...</p>
    </main>
  )

  if (!project) return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center">
      <p className="text-stone-500">Project not found.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
    <div style={{ marginRight: '280px' }} className="flex-1">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <a href="/projects" className="hover:opacity-70">
            <img src="/logo.png" alt="OpenBuild" style={{ height: '75px', marginTop: '-20px' }} />
          </a>
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

        {/* Title bar */}
        <div className="flex text-white text-sm mb-0" style={{ backgroundColor: '#2c4a7c' }}>
          <div className="px-4 py-2 font-semibold" style={{ width: '200px', minWidth: '200px' }}>Posted By</div>
          <div className="px-4 py-2 font-bold text-base flex-1" style={{ borderLeft: '2px solid #1e3560' }}>{project.title}</div>
          <div className="px-4 py-2 font-semibold text-right text-xs opacity-70 flex items-center gap-3" style={{ borderLeft: '2px solid #1e3560' }}>
            {new Date(project.created_at).toLocaleDateString('en-GB')}
            {user?.id === project.user_id && (
              <button
                onClick={handleDeleteProject}
                className="text-red-300 hover:text-red-100 text-xs underline"
              >Delete</button>
            )}
          </div>
        </div>

        {/* Main content row */}
        <div className="flex border border-stone-400 border-t-0">

          {/* Left — profile sidebar */}
          <div className="bg-stone-200 border-r border-stone-400 p-4 flex flex-col items-center text-center" style={{ width: '200px', minWidth: '200px' }}>
            <img
              src={getAvatar(profile?.avatar_url, project.user_id)}
              alt="avatar"
              style={{ display: 'block', width: '100px', height: '100px', objectFit: 'cover' }}
              className="border border-stone-400 mb-3"
            />
            <p className="font-bold text-stone-800 text-sm break-all">{getDisplayName(profile)}</p>
            {profile?.university && <p className="text-xs text-stone-500 mt-1">{profile.university}</p>}
            {(profile?.degree || profile?.course) && (
              <p className="text-xs text-stone-500">{[profile.degree, profile.course].filter(Boolean).join(' — ')}</p>
            )}
            {profile?.graduation_year && <p className="text-xs text-stone-400">Graduating {profile.graduation_year}</p>}
            {profile?.skills && (
              <div className="flex flex-wrap gap-1 mt-3 justify-center">
                {profile.skills.split(',').map((s, i) => (
                  <span key={i} className="text-white text-xs px-2 py-0.5" style={{ backgroundColor: '#2c4a7c' }}>{s.trim()}</span>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-stone-300 w-full">
              <p className="text-xs text-stone-500 uppercase tracking-wide">Reputation</p>
              <p className="text-2xl font-bold" style={{ color: '#2c4a7c' }}>{profile?.reputation || 0}</p>
            </div>
            {project.user_id && (
              <a href={`/user/${project.user_id}`} className="mt-2 text-xs underline" style={{ color: '#2c4a7c' }}>View Profile</a>
            )}
            <p className="text-xs text-stone-400 mt-3 border-t border-stone-300 pt-3 w-full">
              Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB') : '—'}
            </p>
          </div>

          {/* Right — full project content */}
          <div className="flex-1 bg-stone-100 p-6">
            {project.skills && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Seeking</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.split(',').map((skill, i) => (
                    <span key={i} className="text-white text-xs px-2 py-1" style={{ backgroundColor: '#2c4a7c' }}>{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-stone-700 leading-relaxed mb-6">
              {(() => {
                const parts = project.description.split(/\[image:(\d+)\]/)
                return parts.map((part, i) => {
                  if (i % 2 === 1) {
                    const imgIndex = parseInt(part) - 1
                    const url = project.images?.[imgIndex]
                    if (!url) return null
                    return (
                      <img
                        key={i}
                        src={url}
                        alt={`Project image ${imgIndex + 1}`}
                        className="border border-stone-400 cursor-zoom-in hover:opacity-90 my-2"
                        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                        onClick={(e) => { e.stopPropagation(); setZoomedImage(url) }}
                      />
                    )
                  }
                  return (
                    <span key={i}>
                      {part.split('\n').map((line, j, arr) => (
                        <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                      ))}
                    </span>
                  )
                })
              })()}
            </div>

            {/* Contact */}
            <div className="border-t border-stone-300 pt-4 mt-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Contact</p>
              {user ? (
                <div className="text-sm" style={{ color: '#2c4a7c' }}>
                  {project.contact.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-400 italic">
                  <a href="/login" className="underline" style={{ color: '#2c4a7c' }}>Log in</a> to see contact details
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="mt-4 border border-stone-400">

          {/* Comments header */}
          <div className="px-4 py-2 text-white text-sm font-semibold" style={{ backgroundColor: '#2c4a7c' }}>
            Comments ({comments.length})
          </div>

          {/* Comment list */}
          {comments.length === 0 && (
            <div className="bg-stone-100 px-4 py-6 text-stone-400 text-sm text-center border-b border-stone-400">
              No comments yet.
            </div>
          )}

          {comments.map((comment, index) => {
            const cp = commentProfiles[comment.user_id]
            return (
              <div
                key={comment.id}
                className="flex border-b border-stone-400"
                style={{ backgroundColor: index % 2 === 0 ? '#e7e5e4' : '#d6d3d1' }}
              >
                {/* Comment author */}
                <div className="flex flex-col items-center text-center p-3 border-r border-stone-400" style={{ width: '120px', minWidth: '120px' }}>
                <a href={comment.user_id ? `/user/${comment.user_id}` : '#'} className="hover:opacity-80">
                    <img
                    src={cp?.avatar_url || '/default-avatar.jpg'}
                    alt="avatar"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block' }}
                    className="border border-stone-400 mb-1"
                    />
                </a>
                <a href={comment.user_id ? `/user/${comment.user_id}` : '#'} className="text-xs font-bold text-stone-700 hover:underline" style={{ color: comment.user_id ? '#2c4a7c' : undefined }}>
                    {getDisplayName(cp)}
                </a>
                <p className="text-xs text-stone-400">{new Date(comment.created_at).toLocaleDateString('en-GB')}</p>
                </div>

                {/* Comment content */}
                <div className="flex-1 px-4 py-3 flex justify-between items-start">
                  <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-400 hover:text-red-600 underline ml-4 shrink-0"
                    >Delete</button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Add comment */}
          {user ? (
            <div className="bg-stone-100 p-4 flex gap-3 items-start">
              <img
                src="/default-avatar.jpg"
                alt="you"
                style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block' }}
                className="border border-stone-400 shrink-0"
              />
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="border border-stone-400 px-3 py-2 text-sm text-stone-800 bg-white focus:outline-none w-full resize-none"
                  rows={3}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSubmitComment() }}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="text-white text-sm px-4 py-1.5 font-medium disabled:opacity-50"
                    style={{ backgroundColor: '#2c4a7c' }}
                    onMouseOver={(e) => { if (!submittingComment) e.target.style.backgroundColor = '#1e3560' }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = '#2c4a7c' }}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                  <p className="text-xs text-stone-400">Ctrl+Enter to submit</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 px-4 py-4 text-sm text-stone-400 text-center">
              <a href="/login" className="underline" style={{ color: '#2c4a7c' }}>Log in</a> to leave a comment
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-4">
          <a href="/projects" className="text-sm underline" style={{ color: '#2c4a7c' }}>← Back to projects</a>
        </div>

      </div>

      {/* Lightbox */}
      {zoomedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 cursor-zoom-out"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} alt="zoomed" style={{ maxHeight: '90vh', maxWidth: '90vw', display: 'block' }} className="border border-stone-400" />
          <button onClick={() => setZoomedImage(null)} className="absolute top-4 right-6 text-white text-3xl font-bold opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      {/* Right sidebar */}
      <div
        className="fixed top-0 right-0 h-full bg-stone-200 border-l border-stone-400 p-4"
        style={{ width: '260px' }}
      >
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-3">Societies and Events</p>
        <div className="bg-stone-300 border border-stone-400 p-3 text-xs text-stone-500 text-center">Your ad here</div>
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
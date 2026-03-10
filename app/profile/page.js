'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)

  const [skills, setSkills] = useState('')
  const [course, setCourse] = useState('')
  const [university, setUniversity] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [degree, setDegree] = useState('')
  const [anonymous, setAnonymous] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setSkills(profile.skills || '')
        setCourse(profile.course || '')
        setUniversity(profile.university || '')
        setGraduationYear(profile.graduation_year || '')
        setDegree(profile.degree || '')
        setAnonymous(profile.anonymous ?? true)
        setAvatarUrl(profile.avatar_url || null)
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    setAvatarUploadError('')

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setAvatarUploadError('Upload failed, please try again')
      setUploadingAvatar(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data.publicUrl + '?t=' + Date.now()

    await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl })
    setAvatarUrl(publicUrl)
    setUploadingAvatar(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      skills,
      course,
      university,
      graduation_year: graduationYear ? parseInt(graduationYear) : null,
      degree,
      anonymous
    })

    setSaving(false)
    if (!error) setSaved(true)
  }

    const getAvatar = () => {
    if (avatarUrl) return avatarUrl
    return '/default-avatar.jpg'
    }

  const getDisplayEmail = () => {
    if (!user) return ''
    if (anonymous) {
      const [local, domain] = user.email.split('@')
      return `${local[0]}...@${domain}`
    }
    return user.email
  }

  if (loading) return (
    <main className="min-h-screen bg-stone-300 flex items-center justify-center">
      <p className="text-stone-500">Loading...</p>
    </main>
  )

  
  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
        <div className="max-w-4xl mx-auto flex-1 w-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <a href="/projects" className="hover:opacity-70">
            <img src="/logo.png" alt="OpenBuild" style={{ height: '75px', marginTop: '-20px' }} />
          </a>
          <a href="/projects" className="text-sm font-large text-stone-700 hover:underline">Projects</a>
          <a href="/about" className="text-sm font-large text-stone-700 hover:underline">About</a>
          <span className="text-sm font-large text-stone-400">Networking <span className="text-xs">(coming soon)</span></span>
        </div>

        <div className="flex gap-4 items-start">

          {/* Left — edit form */}
          <div className="bg-stone-200 border border-stone-400 p-6 flex-1">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Edit Profile</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">University</label>
                <input
                  type="text"
                  placeholder="e.g. University of Manchester"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">Degree</label>
                <input
                  type="text"
                  placeholder="e.g. BEng, MEng, PhD"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">Course</label>
                <input
                  type="text"
                  placeholder="e.g. Electronic Engineering"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">Graduation Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2027"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-1">Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Python, SolidWorks, PCB design, VHDL, VLSI design"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-stone-100 focus:outline-none w-full"
                />
              </div>

                {/* Avatar upload */}
                <div>
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Profile Picture</label>
                <div className="flex items-center gap-3">
                    <img
                    src={getAvatar()}
                    alt="avatar"
                    style={{ display: 'block', width: '60px', height: '60px' }}
                    className="border border-stone-400"
                    />
                    <div className="flex flex-col gap-1">
                    <div className="flex gap-2">
                        <label
                        className="cursor-pointer text-white text-xs px-3 py-2 font-medium"
                        style={{ backgroundColor: '#2c4a7c' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e3560' }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#2c4a7c' }}
                        >
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        </label>
                        {avatarUrl && (
                        <button
                            type="button"
                            onClick={async () => {
                            await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id)
                            setAvatarUrl(null)
                            }}
                            className="text-xs px-3 py-2 font-medium border border-red-300 text-red-400 hover:bg-red-50"
                        >
                            Remove
                        </button>
                        )}
                    </div>
                    {uploadingAvatar && <p className="text-xs text-stone-400">Uploading...</p>}
                    {avatarUploadError && <p className="text-xs text-red-500">{avatarUploadError}</p>}
                    </div>
                </div>
                </div>


              {/* Anonymity toggle */}
              <div className="flex items-center gap-3 border border-stone-400 bg-stone-100 px-4 py-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4"
                />
                <div>
                  <label htmlFor="anonymous" className="text-sm font-medium text-stone-800 cursor-pointer">
                    Show as anonymous
                  </label>
                  <p className="text-xs text-stone-500">
                    Shows as {user ? `${user.email[0]}...@${user.email.split('@')[1]}` : ''} instead of your full email
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="text-white py-2 font-medium"
                style={{ backgroundColor: '#2c4a7c' }}
                onMouseOver={(e) => { e.target.style.backgroundColor = '#1e3560' }}
                onMouseOut={(e) => { e.target.style.backgroundColor = '#2c4a7c' }}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {saved && <p className="text-green-600 text-sm text-center">Profile saved!</p>}
            </form>
          </div>

          {/* Right — preview */}
          <div className="bg-stone-200 border border-stone-400 p-6" style={{ width: '300px', minWidth: '300px' }}>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-4">Profile Preview</p>
            <img
            src={getAvatar()}
            alt="avatar"
            style={{ display: 'block', width: '120px', height: '120px', objectFit: 'cover' }}
            className="border border-stone-400 mb-4"
            />
            <p className="font-bold text-stone-800 break-all">{getDisplayEmail()}</p>
            {university && <p className="text-sm text-stone-500 mt-1">{university}</p>}
            {(degree || course) && (
              <p className="text-sm text-stone-500">{[degree, course].filter(Boolean).join(' — ')}</p>
            )}
            {graduationYear && <p className="text-sm text-stone-500">Graduating {graduationYear}</p>}
            {skills && (
              <div className="flex flex-wrap gap-1 mt-3">
                {skills.split(',').map((s, i) => (
                  <span key={i} className="text-white text-xs px-2 py-1" style={{ backgroundColor: '#2c4a7c' }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-stone-400 mt-4 border-t border-stone-300 pt-3">
              Member since {new Date(user.created_at).toLocaleDateString('en-GB')}
            </p>
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
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function Post() {
  const [title, setTitle] = useState('')
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [contact, setContact] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [existingSkills, setExistingSkills] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState(null)
  const editorRef = useRef(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)
    }
    getUser()

    const fetchSkills = async () => {
      const { data } = await supabase.from('projects').select('skills')
      const all = data?.flatMap(p => p.skills ? p.skills.split(',').map(s => s.trim()) : []) || []
      setExistingSkills([...new Set(all)].sort())
    }
    fetchSkills()
  }, [])

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed])
    setSkillInput('')
  }

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill))

  const uploadAndInsertImage = async (file) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      insertImageAtCursor(data.publicUrl)
    }
    setUploading(false)
  }

  const insertImageAtCursor = (url) => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    const img = document.createElement('img')
    img.src = url
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
    img.style.display = 'block'
    img.style.margin = '8px 0'
    img.className = 'border border-stone-400'
    img.contentEditable = 'false'
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.insertNode(img)
      range.setStartAfter(img)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      editor.appendChild(img)
    }
  }

  const handleEditorDrop = async (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    for (const file of files) await uploadAndInsertImage(file)
  }

  const handleEditorPaste = async (e) => {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(i => i.type.startsWith('image/'))
    if (imageItem) {
      e.preventDefault()
      const file = imageItem.getAsFile()
      await uploadAndInsertImage(file)
    }
  }

  // Extract plain text and image URLs from the editor HTML
  const getDescriptionAndImages = () => {
    const editor = editorRef.current
    if (!editor) return { description: '', images: [] }
    const images = []
    
    const walk = (node) => {
      let text = ''
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent
        } else if (child.nodeName === 'IMG') {
          images.push(child.src)
          text += `\n[image:${images.length}]\n`
        } else if (child.nodeName === 'BR') {
          text += '\n'
        } else if (child.nodeName === 'DIV' || child.nodeName === 'P') {
          const inner = walk(child)
          text += '\n' + inner
        } else {
          text += walk(child)
        }
      }
      return text
    }

    const description = walk(editor).replace(/^\n/, '').replace(/\n{3,}/g, '\n\n')
    return { description, images }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { description, images } = getDescriptionAndImages()

    const { data, error } = await supabase.from('projects').insert({
      title,
      description,
      skills: skills.join(', '),
      contact,
      images,
      user_id: user.id
    }).select().single()

    if (error) setError(error.message)
    else window.location.href = `/projects/${data.id}`
  }

  if (success) return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
    <div style={{ marginRight: '280px' }} className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <a href="/projects" className="text-2xl font-bold text-stone-800 hover:opacity-70">OpenBuild</a>
        </div>
        <div className="bg-stone-200 border border-stone-400 p-8 text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Project posted!</h2>
          <p className="text-stone-500 mb-4">Your project is now live on OpenBuild.</p>
          <a href="/projects" className="underline text-sm" style={{ color: '#2c4a7c' }}>Browse all projects</a>
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-stone-300 px-4 py-8 flex flex-col">
    <div style={{ marginRight: '280px' }} className="flex-1">


        <div className="flex justify-between items-center mb-3">
          <a href="/projects" className="text-2xl font-bold text-stone-800 hover:opacity-70">OpenBuild</a>
          <a href="/projects" className="text-sm underline" style={{ color: '#2c4a7c' }}>← Back to projects</a>
        </div>

        <div className="text-white px-4 py-2 font-semibold" style={{ backgroundColor: '#2c4a7c' }}>
          Post a Project
        </div>

        <div className="flex border border-stone-400 border-t-0">

          {/* Left — info panel */}
          <div className="bg-stone-200 border-r border-stone-400 p-4 flex flex-col items-center text-center" style={{ width: '200px', minWidth: '200px' }}>
            <img
              src={profile?.avatar_url || `/default-avatar.jpg`}
              alt="avatar"
              style={{ display: 'block', width: '80px', height: '80px', objectFit: 'cover' }}
              className="border border-stone-400 mb-3"
            />
            <p className="text-xs text-stone-500 leading-relaxed">
              Your project will be visible to all students on OpenBuild.
            </p>
            <p className="text-xs text-stone-400 mt-3">
              Make sure your contact details are correct before posting.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-300 w-full text-left">
              <p className="text-xs text-stone-400 leading-relaxed">💡 In the description, you can <strong>drag & drop</strong> or <strong>paste</strong> images directly inline.</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 bg-stone-100 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col">

              {/* Title */}
              <div className="py-6 border-b border-stone-300">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Project Title</label>
                <input
                  type="text"
                  placeholder="What are you building?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-white focus:outline-none w-full"
                  required
                />
              </div>

              {/* Description — rich editor */}
              <div className="py-6 border-b border-stone-300">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">
                  Description
                  {uploading && <span className="ml-2 text-stone-400 normal-case font-normal">Uploading image...</span>}
                </label>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onDrop={handleEditorDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onPaste={handleEditorPaste}
                  className="border border-stone-400 px-4 py-3 text-stone-800 bg-white focus:outline-none w-full min-h-40"
                  style={{
                    outline: dragOver ? '2px dashed #2c4a7c' : undefined,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                  data-placeholder="Describe your project... drag & drop or paste images anywhere inline"
                />
                <style>{`
                  [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #a8a29e;
                    pointer-events: none;
                  }
                `}</style>
              </div>

              {/* Skills */}
              <div className="py-6 border-b border-stone-300">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Seeking</label>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((s, i) => (
                      <span key={i} className="text-white text-xs px-2 py-1 flex items-center gap-1" style={{ backgroundColor: '#2c4a7c' }}>
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="opacity-70 hover:opacity-100 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                    className="border border-stone-400 px-4 py-2 text-stone-800 bg-white focus:outline-none flex-1"
                    list="skills-list"
                  />
                  <datalist id="skills-list">
                    {existingSkills.map(s => <option key={s} value={s} />)}
                  </datalist>
                  <button type="button" onClick={() => addSkill(skillInput)} className="text-white px-3 py-2 text-sm" style={{ backgroundColor: '#2c4a7c' }}>
                    Add
                  </button>
                </div>
                {existingSkills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-stone-400 mb-1">Suggested:</p>
                    <div className="flex flex-wrap gap-1">
                      {existingSkills.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
                        <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2 py-0.5 border border-stone-400 text-stone-600 bg-stone-200 hover:bg-stone-300">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="py-6 border-b border-stone-300">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide block mb-2">Contact</label>
                <textarea
                  placeholder="How should people reach you? (email, LinkedIn, Discord...)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="border border-stone-400 px-4 py-2 text-stone-800 bg-white focus:outline-none w-full resize-none"
                  rows={3}
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-white py-2 px-6 font-medium"
                  style={{ backgroundColor: '#2c4a7c' }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#1e3560' }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#2c4a7c' }}
                >
                  Post Project
                </button>
              </div>

            </form>
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
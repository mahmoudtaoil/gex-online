'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewService() {
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState('')
  const router = useRouter()

  async function upload(e: any) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json(); setImage(data.url); setUploading(false)
  }

  async function create(e: any) {
    e.preventDefault()
    const fd = new FormData(e.target)
    await fetch('/api/service/create', { method: 'POST', body: fd })
    router.push('/admin')
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <h1>خدمة جديدة</h1>
        <form onSubmit={create} style={{ background: '#0f172a', padding: 16, borderRadius: 12, display: 'grid', gap: 12 }}>
          <input name="name" required placeholder="الاسم" style={{ padding: 10, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
          <input name="slug" required placeholder="slug انجليزي" style={{ padding: 10, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
          <input name="category" required placeholder="القسم" style={{ padding: 10, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
          <div><input type="file" accept="image/*" onChange={upload} />{uploading && ' جاري الرفع...'}{image && <img src={image} style={{ width: 80, height: 80, borderRadius: 8, marginTop: 8, objectFit: 'cover' }} />}<input type="hidden" name="image" value={image} /></div>
          <button style={{ padding: 12, background: 'linear-gradient(90deg,#8b5cf6,#ec4899)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700 }}>إنشاء</button>
        </form>
      </div>
    </div>
  )
}
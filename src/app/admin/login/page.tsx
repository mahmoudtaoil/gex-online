'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handle = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    
    const res = await signIn('credentials', { 
      email: user, 
      password: pass, 
      redirect: false 
    })
    
    if (res?.ok) {
      router.push('/admin')
    } else {
      setErr('بيانات خاطئة')
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15), transparent 50%)' }} />
      
      <form onSubmit={handle} style={{ position: 'relative', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)', padding: 40, borderRadius: 16, width: '100%', maxWidth: 380, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>
            <span style={{ color: '#fff' }}>GEX</span>
            <span style={{ background: 'linear-gradient(90deg,#ec4899,#8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>ADMIN</span>
          </div>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>لوحة تحكم المتجر</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <input 
            type="text" 
            placeholder="اسم المستخدم" 
            value={user} 
            onChange={e=>setUser(e.target.value)} 
            required 
            disabled={loading}
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = 'rgba(51,65,85,0.8)'}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            value={pass} 
            onChange={e=>setPass(e.target.value)} 
            required 
            disabled={loading}
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 10, color: '#fff', fontSize: 15, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = 'rgba(51,65,85,0.8)'}
          />
        </div>

        {err && (
          <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
            {err}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#475569' : 'linear-gradient(90deg,#8b5cf6,#ec4899)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px 0 rgba(139,92,246,0.3)' }}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 12, color: '#475569' }}>
          GEX ONLINE © 2024
        </div>
      </form>
    </div>
  )
}
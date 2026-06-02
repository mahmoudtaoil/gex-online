import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import DeleteButton from './DeleteButton'

async function toggleService(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) return
  await prisma.service.update({ where: { id }, data: { isActive:!service.isActive } })
  revalidatePath('/admin')
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const params = await searchParams
  const q = (params.q || '').trim()
  const activeCat = params.cat || 'all'

  const services = await prisma.service.findMany({
    where: q? { name: { contains: q, mode: 'insensitive' } } : undefined,
    orderBy: [{ category: 'asc' }, { order: 'asc' }]
  })

  const grouped = services.reduce((acc: Record<string, any[]>, s: any) => {
    const cat = s.category || 'أخرى'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()
  const filteredServices = activeCat === 'all'? services : (grouped[activeCat] || [])

  const totalPackages = services.reduce((sum: number, s: any) => sum + (s.packages?.length || 0), 0)
  const totalImages = services.filter((s: any) => s.image).length

  const catMeta: Record<string, { name: string; color: string; icon: string }> = {
    apps: { name: 'التطبيقات', color: '#6366f1', icon: 'M3 7h18M5 11h2M9 11h2M3 15h18v4H3z' },
    balance: { name: 'شحن الرصيد', color: '#22c55e', icon: 'M12 8c-2 0-3 1-3 2s1 2 3 1 3 2-1 2-3 2M12 4v2m0 12v2' },
    cards: { name: 'البطاقات', color: '#f59e0b', icon: 'M4 6h4v4H4zM4 14h4v4H4zM14 6h4v4h-4zM14 14h4v4h-4z' },
    games: { name: 'الألعاب', color: '#a855f7', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M6 12h.01M18 12h.01' },
    social: { name: 'سوشيال ميديا', color: '#ec4899', icon: 'M12 21l-1-1C6 16 3 13 3 9a5 5 0 0110 0 5 5 0 0110 0c0 4-3 7-8 11l-1 1z' },
    subs: { name: 'الاشتراكات', color: '#06b6d4', icon: 'M5 5h14v8l-4 3H9L5 13V5zM2 17h20' },
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#040818', borderLeft: '1px solid #1e293b', position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 26, fontWeight: 900 }}>GEX<span style={{ color: '#a855f7' }}>X</span></div>
          <div style={{ fontSize: 11, color: '#64748b' }}>ONLINE</div>
        </div>

        <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8, background: activeCat==='all'? 'linear-gradient(90deg, rgba(168,85,247,0.25), transparent)' : 'transparent', borderRadius: 10, color: '#fff', textDecoration: 'none', borderRight: activeCat==='all'? '3px solid #a855f7' : '3px solid transparent' }}>
            <svg width="20" height="20" fill="none" stroke="#a855f7" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 6px #a855f7)' }}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            الرئيسية
          </Link>

          <div style={{ color: '#475569', fontSize: 11, margin: '16px 14px 8px', letterSpacing: 1 }}>الأقسام</div>
          {categories.map(cat => {
            const meta = catMeta[cat] || { name: cat, color: '#94a3b8', icon: 'M4 6h16' }
            const isActive = activeCat === cat
            return (
              <Link key={cat} href={`/admin?cat=${cat}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 4, borderRadius: 10, background: isActive? 'rgba(15,23,42,0.8)' : 'transparent', textDecoration: 'none', border: isActive? `1px solid ${meta.color}40` : '1px solid transparent', transition: '0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="20" height="20" fill="none" stroke={meta.color} strokeWidth="1.8" style={{ filter: `drop-shadow(0 0 8px ${meta.color})` }}><path d={meta.icon} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ color: isActive? '#fff' : '#cbd5e1', fontSize: 14 }}>{meta.name}</span>
                </div>
                <span style={{ background: '#0f172a', color: meta.color, fontSize: 11, padding: '2px 8px', borderRadius: 6, border: `1px solid ${meta.color}30`, boxShadow: isActive? `0 0 10px ${meta.color}40` : 'none' }}>{grouped[cat].length}</span>
              </Link>
            )
          })}
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #1e293b' }}>
          <Link href="/admin/settings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 8, background: 'rgba(139,92,246,0.12)', borderRadius: 8, color: '#c4b5fd', textDecoration: 'none', fontSize: 13, border: '1px solid rgba(139,92,246,0.3)' }}>
            <span>الإعدادات</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </Link>

          <Link href="/" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#0f172a', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13, border: '1px solid #1e293b' }}>← العودة للموقع</Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0 }}>👋 مرحباً بك في لوحة إدارة GEX ONLINE</h1>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: 14 }}>تحكم كامل في متجرك وخدماتك</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { t: 'الأقسام', v: categories.length },
            { t: 'الخدمات', v: services.length },
            { t: 'الباقات', v: totalPackages },
            { t: 'الصور', v: totalImages },
          ].map(c => (
            <div key={c.t} style={{ background: '#0b1020', border: '1px solid #1e293b', borderRadius: 14, padding: 18 }}>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{c.t}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{c.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <div style={{ background: '#0b1020', border: '1px solid #1e293b', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ margin: 0 }}>الخدمات {activeCat!=='all' && `- ${catMeta[activeCat]?.name}`}</h3>
              <Link href="/admin/service/new" style={{ padding: '6px 12px', background: '#a855f7', borderRadius: 8, color: '#fff', textDecoration: 'none', fontSize: 13 }}>+ إضافة خدمة</Link>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: 14 }}>
                <thead style={{ color: '#64748b', position: 'sticky', top: 0, background: '#0b1020' }}>
                  <tr><th style={{ textAlign: 'right', padding: 10 }}></th><th style={{ textAlign: 'right', padding: 10 }}>الخدمة</th><th style={{ textAlign: 'right', padding: 10 }}>القسم</th><th style={{ textAlign: 'right', padding: 10 }}>الحالة</th><th style={{ textAlign: 'right', padding: 10 }}>تعديل</th></tr>
                </thead>
                <tbody>
                  {filteredServices.map((s:any) => (
                    <tr key={s.id} style={{ borderTop: '1px solid #1e293b' }}>
                      <td style={{ padding: 10 }}><img src={s.image?.replace('/upload/', '/upload/f_auto,q_auto/') || ''} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', background: '#1e293b' }} loading="lazy" /></td>
                      <td style={{ padding: 10 }}>{s.name}</td>
                      <td style={{ padding: 10, color: '#94a3b8' }}>{catMeta[s.category]?.name || s.category}</td>
                      <td style={{ padding: 10 }}>
                        <form action={toggleService}><input type="hidden" name="id" value={s.id} /><button style={{ background: s.isActive? '#052e16' : '#450a0a', color: s.isActive? '#22c55e' : '#ef4444', border: 'none', padding: '4px 12px', borderRadius: 12, fontSize: 12, cursor: 'pointer' }}>{s.isActive? 'مفعل' : 'معطل'}</button></form>
                      </td>
                      <td style={{ padding: 10 }}>
                        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
                          <Link href={`/admin/service/${s.slug}`} style={{ color: '#a78bfa' }}>تعديل</Link>
                          <DeleteButton id={s.id} name={s.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
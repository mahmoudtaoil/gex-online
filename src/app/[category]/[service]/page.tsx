import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSettings } from '@/lib/settings'

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // نجيب الخدمة والإعدادات مع بعض
  const [service, settings] = await Promise.all([
    prisma.service.findUnique({ where: { slug } }),
    getSettings()
  ])
  
  if (!service || !service.isActive) notFound()

  const packages = (service.packages as any[]).filter((p:any) => p.isActive !== false).sort((a:any,b:any) => a.price - b.price)
  const isTwoColumns = packages.length > 11
  const whatsappNumber = settings.whatsapp.replace(/[^0-9]/g,'') // يقرأ من الإعدادات

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div style={{ position: 'fixed', inset: 0, background: '#020617' }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <header style={{ background: 'rgba(2,6,23,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 0' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}><div style={{ fontWeight: 900, fontSize: 24 }}><span style={{ color: '#fff' }}>GEX</span><span style={{ background: 'linear-gradient(90deg,#ec4899,#8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>ONLINE</span></div></Link>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .service-grid { display: grid; grid-template-columns: 380px 1fr; gap: 32px; align-items: start; }
            .service-card { position: sticky; top: 24px; }
            .packages-grid { display: grid; gap: 12px; direction: ltr; }
            .packages-2col { grid-template-columns: 1fr 1fr; }
            .packages-1col { grid-template-columns: 1fr; }
            @media (max-width: 1024px) {
              .service-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
              .service-card { position: relative !important; top: 0 !important; }
            }
            @media (max-width: 768px) {
              .packages-2col { grid-template-columns: 1fr !important; }
              main { padding: 24px 16px !important; }
            }
          `}} />
          
          <div className="service-grid">
            <div className="service-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'inline-block', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, marginBottom: 16 }}>{service.name_en}</div>
              <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#1e293b' }} />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px 0', textAlign: 'center' }}>{service.name}</h1>
              <p style={{ color: '#ec4899', fontSize: 14, textAlign: 'center', margin: 0, fontWeight: 600 }}>{service.name_en}</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                <span>{service.name}</span>
                <span>شرح عن الخدمة</span>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px 0' }}><span style={{ background: 'linear-gradient(90deg,#ec4899,#8b5cf6)', WebkitBackgroundClip: 'text', color: 'transparent' }}>قائمة الباقات</span></h2>
              <div className={`packages-grid ${isTwoColumns ? 'packages-2col' : 'packages-1col'}`}>
                {packages.map((pkg:any) => {
                  const message = `مرحبا GEX ONLINE 👋

أريد شراء:
📦 ${pkg.name}
🎮 الخدمة: ${service.name}
💰 السعر: ${pkg.price.toLocaleString('tr-TR')} ₺

الرجاء تأكيد الطلب وشكرا`
                  
                  return (
                    <div key={pkg.id} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg,#8b5cf6,#06b6d4)', borderRadius: '3px 0 0 3px' }} />
                      <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" style={{ padding: '7px 14px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.5)', borderRadius: 8, color: '#ec4899', fontSize: 13, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
                        <svg width="15" height="15" fill="#25D366" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4 1.5 5.7L0 24l6.3-1.7A11.9 0 0012 24c6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>
                        شراء الآن
                      </a>
                      <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}><div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{pkg.name}</div></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 85, justifyContent: 'flex-end' }}>
                        <span style={{ color: '#10b981', fontSize: 15, fontWeight: 600 }}>{pkg.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                        <span style={{ color: '#10b981', fontSize: 15, fontWeight: 700 }}>₺</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { t: 'تسليم فوري', d: 'خلال دقائق', i: '⚡' },
              { t: 'أفضل الأسعار', d: 'أرخص السوق', i: '🏷' },
              { t: 'دعم 24/7', d: 'على مدار الساعة', i: '🎧' },
              { t: 'أمان كامل', d: '100% آمن', i: '🛡' },
            ].map(f => (
              <div key={f.t} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{f.i} {f.t}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{f.d}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const cats = [
  { k: 'apps', t: 'التطبيقات' },
  { k: 'games', t: 'الألعاب' },
  { k: 'balance', t: 'شحن الرصيد' },
  { k: 'social', t: 'سوشيال ميديا' },
  { k: 'cards', t: 'البطاقات' },
  { k: 'subs', t: 'الاشتراكات' },
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => { const cat = searchParams.get('cat'); setActive(cat); }, [searchParams]);
  useEffect(() => {
    fetch('/api/service', { cache: 'no-store' }).then(r => r.json()).then(data => { setServices(Array.isArray(data)? data : []); setLoading(false); }).catch(() => setLoading(false));
    fetch('/api/settings', { cache: 'no-store' }).then(r => r.json()).then(setSettings).catch(()=>{});
  }, []);

  const handleSetActive = (k: string | null) => {
    setActive(k);
    setQuery('');
    setShowSearch(false);
    if (k) router.push(`/?cat=${k}`, { scroll: false });
    else router.push(`/`, { scroll: false });
  };

  const current = cats.find(x => x.k === active);
  const filteredServices = useMemo(() => {
    if (!query) return services;
    const q = query.toLowerCase().trim();
    return services.filter(s => s.name?.toLowerCase().includes(q) || s.slug?.toLowerCase().includes(q));
  }, [services, query]);

  const items = current? services.filter((x: any) => x.category === active && x.isActive!== false) : [];
  const searchResults = query? filteredServices.filter(s => s.isActive!== false) : [];
  const bgUrl = settings.bgHome || '/images/backgrounds/gx.png';
  const logoUrl = settings.logoUrl || '';

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url('${bgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9, filter: 'brightness(0.8) blur(0.5px)' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.7) 70%, #020617 100%)' }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <header style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.6) 70%, transparent 100%)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', minHeight: 76, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                {logoUrl? (<img src={logoUrl} alt="GEX" style={{ height: 54, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.4))' }} />) : (<div style={{ fontFamily: 'system-ui', fontWeight: 900, fontSize: 26, letterSpacing: -1 }}>GEX<span style={{ background: 'linear-gradient(90deg,#38bdf8,#a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>X</span></div>)}
              </Link>
              <button onClick={() => setShowSearch(!showSearch)} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="17" height="17" fill="none" stroke="#cbd5e1" strokeWidth="2"><circle cx="7" cy="7" r="5.5"/><path d="M12 12l3.5 3.5"/></svg>
              </button>
            </div>

            {/* أزرار الهيدر - تم تكبيرها مع Glow مستطيل */}
            <nav style={{ display: 'flex', gap: 8, direction: 'rtl', flexWrap: 'wrap', justifyContent: 'center', flex: '1 1 auto' }}>
              {cats.map(c => {
                const isActive = active===c.k;
                return (
                  <button key={c.k} onClick={() => handleSetActive(c.k)} style={{
                    position: 'relative',
                    padding: '12px 20px',
                    background: isActive? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isActive? '#a855f7' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 8,
                    color: isActive? '#fff' : '#e2e8f0',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: isActive? '0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(168,85,247,0.3), inset 0 0 12px rgba(168,85,247,0.2)' : '0 0 8px rgba(255,255,255,0.05)',
                    textShadow: isActive? '0 0 8px rgba(255,255,255,0.8)' : 'none',
                    whiteSpace: 'nowrap'
                  }}>
                    {c.t}
                  </button>
                )
              })}
            </nav>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#a855f7,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(168,85,247,0.5)', cursor: 'pointer' }}>
                  <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>
                </div>
              </Link>
              <a href={settings?.whatsapp? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g,'')}` : '#'} target="_blank" style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(15,20,35,0.9)', border: '1.5px solid #22c55e', color: '#fff', display: 'flex', gap: 6, alignItems: 'center', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}>
                واتساب
                <svg width="17" height="17" fill="#25D366" viewBox="0 0 24 24"><path d="M12 0a12 0 00-10 19l-2 5 5-2a12 0 1017-17A12 0 0012 0z"/></svg>
              </a>
            </div>
          </div>
          {showSearch && (<div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px 14px' }}><div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث... ببجي، PUBG" style={{ width: '100%', height: 42, background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 10, padding: '0 38px 0 14px', color: '#fff', fontSize: 15, outline: 'none' }} /><svg style={{ position: 'absolute', right: 11, top: 11 }} width="19" height="19" fill="none" stroke="#a855f7" strokeWidth="2"><circle cx="8" cy="8" r="6.5"/><path d="M14 14l3 3"/></svg></div></div>)}
        </header>

        <main style={{ maxWidth: 1536, margin: '0 auto', padding: '28px 16px', minHeight: '60vh' }}>
          {query? (
            <div className="gex-grid">
              {searchResults.map((s:any) => (
                <Link key={s.id} href={`/service/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="service-card">
                    <div style={{ position: 'absolute', bottom: 10, left: 8, right: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px #000' }}>{s.name.split(' ')[0]}</div>
                      <div style={{ fontSize: 10.5, color: '#cbd5e1', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                      <div style={{ height: 22, borderRadius: 7, background: 'linear-gradient(90deg,#22d3ee,#a855f7)', padding: 1 }}><div style={{ height: '100%', background: 'rgba(0,0,0,0.8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>اشحن الآن</div></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : active && current? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>{current.t}</h1>
                <p style={{ color: '#9aa3b8', marginTop: 8, fontSize: 15 }}>شحن جميع {current.t} بأفضل الأسعار</p>
              </div>

              {loading? <div style={{ textAlign: 'center', color: '#64748b', fontSize: 16 }}>جاري التحميل...</div> : (
                <div className="gex-grid">
                  {items.map((s:any) => (
                    <Link key={s.id} href={`/service/${s.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="service-card" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%), url('${s.image || '/images/backgrounds/gx.png'}')` }}>
                        <div style={{ position: 'absolute', bottom: 10, left: 8, right: 8, textAlign: 'center' }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px #000' }}>{s.name.split(' ')[0]}</div>
                          <div style={{ fontSize: 10.5, color: '#cbd5e1', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                          <div style={{ height: 22, borderRadius: 7, background: 'linear-gradient(90deg,#22d3ee,#a855f7)', padding: 1 }}><div style={{ height: '100%', background: 'rgba(0,0,0,0.8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>اشحن الآن</div></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (<div style={{ height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ textAlign: 'center' }}>{logoUrl? <img src={logoUrl} alt="logo" style={{ height: 130, margin: '0 auto 18px', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))' }} /> : <h1 style={{ fontSize: 48, fontWeight: 900, background: 'linear-gradient(90deg,#38bdf8,#a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>GEX ONLINE</h1>}<p style={{ color: '#9aa3b8', fontSize: 16 }}>اضغط على أيقونة البحث أو اختر قسم</p></div></div>)}
        </main>
      </div>

      <style>{`
        /* Grid متجاوب حسب طلبك: 2 - 4 - 5 - 6 */
      .gex-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, 1fr);
        }
        /* تابلت: 4 كروت */
        @media (min-width: 768px) {
        .gex-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
          }
        }
        /* لابتوب: 5 كروت */
        @media (min-width: 1024px) {
        .gex-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
          }
        }
        /* شاشة كبيرة: 6 كروت */
        @media (min-width: 1536px) {
        .gex-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 18px;
          }
        }

      .service-card {
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          background: #0b1020;
          border: 1.5px solid rgba(56,189,248,0.2);
          background-size: cover;
          background-position: center;
          transition: all 0.3s;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
      .service-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(168,85,247,0.6);
          box-shadow: 0 8px 30px rgba(168,85,247,0.4);
        }

        @media (max-width: 768px) {
          header nav button {
            font-size: 13px!important;
            padding: 10px 14px!important;
          }
        .service-card {
            height: 190px;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (<Suspense fallback={<div dir="rtl" style={{minHeight:'100vh',background:'#020617',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize: 18}}>جاري التحميل...</div>}><HomeContent /></Suspense>);
}
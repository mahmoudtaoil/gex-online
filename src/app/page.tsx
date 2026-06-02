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

const filters = [
  { k: 'subs', t: 'الاشتراكات', ic: 'M5 5h14v8l-4 3H9L5 13V5zM2 17h20', c: '#06b6d4' },
  { k: 'cards', t: 'البطاقات', ic: 'M4 6h4v4H4zM4 14h4v4H4zM14 6h4v4h-4zM14 14h4v4h-4z', c: '#f59e0b' },
  { k: 'social', t: ' سوشيال ميديا', ic: 'M12 21l-1-1C6 16 3 13 3 9a5 5 0 0110 0 5 5 0 0110 0c0 4-3 7-8 11l-1 1z', c: '#ec4899' },
  { k: 'balance', t: 'شحن الرصيد', ic: 'M12 8c-2 0-3 1-3 2s1 2 3 1 3 2-1 2-3 2M12 4v2m0 12v2', c: '#22c55e' },
  { k: 'games', t: 'الألعاب', ic: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M6 12h.01M18 12h.01', c: '#a855f7' },
  { k: 'apps', t: 'التطبيقات', ic: 'M3 7h18M5 11h2M9 11h2M3 15h18v4H3z', c: '#6366f1' },
];

const icons = {
  telegram: (c:string) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M21.5 3.5L2.8 10.8c-1.4-.9 1.9.1 2.2l4.6 1.4 1.8 5.6c.2.7 1.9 1.5.4l2.7-2.6 5.5 4c.8.6 1.9.3 2.2-.7L23.5 4.8c.3-1-.7-1.8-2-1.3z"/></svg>,
  instagram: (c:string) => <svg width="20" height="20" viewBox="0 0 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={c} stroke="none"/></svg>,
  tiktok: (c:string) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M16.6 3c.5 2.3 2 3.8 4.4 4.2v3.3c-1.6.1-3.1-.4-4.4-1.3v6.7c0 4.5-3.7 7.2-7.2 6.3-2.5-.6-4.4-3-4.4-5.7 0-3.2 2.3-5.8 5.5-5.9v3.4c-.7.1-1.4.5-1.8 1.2-.6 1.1.1 2.5 1.3 2.7 1.2.2 2.3-.6 2.3-1.8V3h4.3z"/></svg>,
  facebook: (c:string) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.5 9.9v-7H8v-2.9h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v1.8H17l-.5 2.9h-2.4v7C18.3 21.1 22 17 22 12z"/></svg>,
  gmail: (c:string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6c0-1.1.9-2 2-2h12c1.1 0 2.9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6z" fill={c} opacity=".2"/><path d="M20 6l-8 5-8-5" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="4" y="4" width="16" height="16" rx="2" stroke={c} strokeWidth="2" fill="none"/></svg>,
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat');
    setActive(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/service', { cache: 'no-store' }).then(r => r.json()).then(data => {
      setServices(Array.isArray(data)? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
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
    return services.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q)
    );
  }, [services, query]);

  const items = current? services.filter((x: any) => x.category === active && x.isActive!== false) : [];
  const searchResults = query? filteredServices.filter(s => s.isActive!== false) : [];

  const socials = [
    { k: 'telegram', url: settings.telegram },
    { k: 'instagram', url: settings.instagram },
    { k: 'tiktok', url: settings.tiktok },
    { k: 'facebook', url: settings.facebook },
    { k: 'gmail', url: settings.gmail },
  ].filter(s => s.url);

  const bgUrl = settings.bgHome || '/images/backgrounds/gx.png';
  const logoUrl = settings.logoUrl || '';

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url('${bgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9, filter: 'brightness(0.8) blur(0.5px)' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.7) 70%, #020617 100%)' }} />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <header style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.4) 70%, transparent 100%)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', height: 80, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'ltr' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                {logoUrl? (
                  <img src={logoUrl} alt="GEX" style={{ height: 62, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.4))' }} />
                ) : (
                  <div style={{ fontFamily: 'system-ui', fontWeight: 900, fontSize: 26, letterSpacing: -1 }}>GEX<span style={{ background: 'linear-gradient(90deg,#38bdf8,#a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>X</span><div style={{ fontSize: 9, opacity: 0.6, letterSpacing: 3, marginTop: -4 }}>ONLINE</div></div>
                )}
              </Link>
              <button onClick={() => setShowSearch(!showSearch)} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="18" height="18" fill="none" stroke="#cbd5e1" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M13 13l4 4"/></svg>
              </button>
            </div>
            <nav style={{ display: 'flex', gap: 8, direction: 'rtl', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {cats.map(c => (
                <button key={c.k} onClick={() => handleSetActive(c.k)} style={{ position: 'relative', padding: '9px 20px', background: active===c.k? 'rgba(30,25,50,0.7)' : 'transparent', border: active===c.k? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent', borderRadius: 12, color: active===c.k? '#fff' : '#9aa3b2', fontSize: 14, cursor: 'pointer', transition: '0.2s' }}>
                  {c.t}
                  {active===c.k && <div style={{ position: 'absolute', bottom: -14, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg,transparent,#a855f7,transparent)', filter: 'blur(0.5px)' }} />}
                </button>
              ))}
            </nav>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#a855f7,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(168,85,247,0.5)', cursor: 'pointer' }}>
                  <svg width="19" height="19" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>
                </div>
              </Link>
              <a href={settings?.whatsapp? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g,'')}` : '#'} target="_blank" style={{ padding: '9px 16px', borderRadius: 12, background: 'rgba(15,20,35,0.8)', border: '1.5px solid', borderImage: 'linear-gradient(90deg,#22d3ee,#a855f7) 1', color: '#fff', display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, textDecoration: 'none' }}>
                واتساب
                <svg width="18" height="18" fill="#25D366" viewBox="0 0 24 24"><path d="M12 0a12 12 0 00-10 19l-2 5 5-2a12 12 0 1017-17A12 12 0 0012 0z"/></svg>
              </a>
            </div>
          </div>
          {showSearch && (
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px 16px' }}>
              <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث... ببجي، PUBG، Netflix" style={{ width: '100%', height: 44, background: 'rgba(10,14,25,0.95)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 12, padding: '0 40px 0 14px', color: '#fff', fontSize: 15, outline: 'none' }} />
                <svg style={{ position: 'absolute', right: 12, top: 12 }} width="20" height="20" fill="none" stroke="#a855f7" strokeWidth="2"><circle cx="9" cy="9" r="7"/><path d="M15 15l4 4"/></svg>
              </div>
            </div>
          )}
        </header>

        <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px', minHeight: '60vh' }}>
          {query? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700 }}>نتائج البحث عن "{query}"</h2>
                <p style={{ color: '#9aa3b8' }}>{searchResults.length} نتيجة</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16 }}>
                {searchResults.map((s:any) => (
                  <Link key={s.id} href={`/service/${s.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ height: 220, borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#0b1020', border: '1px solid rgba(56,189,248,0.18)', backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.88), transparent 58%), url('${s.image || '/images/backgrounds/gx.png'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.name}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {searchResults.length === 0 && <div style={{ textAlign: 'center', color: '#64748b', marginTop: 60 }}>ما لقينا شي... جرب كلمة تانية</div>}
            </>
          ) : active && current? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h1 style={{ fontSize: 40, fontWeight: 800, display: 'inline-flex', gap: 12, alignItems: 'center' }}>{current.t}<svg width="32" height="32" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M9 15h2v2H9v-2zm6 0h2v2h-2v-2zM6 12a6 6 0 1012 0 6 6 0 00-12 0z"/></svg></h1>
                <p style={{ color: '#9aa3b8', marginTop: 8 }}>شحن جميع {current.t} بأفضل الأسعار</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 38 }}>
                <div style={{ display: 'flex', gap: 10, padding: 8, background: 'rgba(10,14,25,0.85)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', direction: 'ltr' }}>
                  {filters.map(f => { const on = f.k === active; return (
                    <button key={f.k} onClick={() => handleSetActive(f.k)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 18px', borderRadius: 12, background: on? 'rgba(20,25,40,1)' : 'transparent', border: '1.5px solid transparent', position: 'relative', color: on? '#fff' : '#7b8499', fontSize: 14, cursor: 'pointer', transition: '0.25s', boxShadow: on? `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px ${f.c}30` : 'none' }}>
                      {on && <div style={{ position: 'absolute', inset: -1.5, borderRadius: 12, padding: 1.5, background: `linear-gradient(90deg, #22d3ee, ${f.c})`, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />}
                      <span>{f.t}</span>
                      <svg width="19" height="19" fill="none" stroke={on? f.c : '#6b7280'} strokeWidth="1.8"><path d={f.ic} strokeLinecap="round"/></svg>
                    </button>
                  )})}
                </div>
              </div>
              {loading? <div style={{ textAlign: 'center', color: '#64748b' }}>جاري التحميل...</div> : (
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-24px -16px', background: 'radial-gradient(480px 200px at 50% 0%, rgba(168,85,247,0.11), transparent 70%), radial-gradient(380px 160px at 85% 25%, rgba(34,211,238,0.08), transparent 65%)', filter: 'blur(22px)', pointerEvents: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, position: 'relative' }}>
                    {items.map((s:any) => (
                      <Link key={s.id} href={`/service/${s.slug}`} style={{ textDecoration: 'none' }}>
                        <div style={{ height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#0b1020', border: '1px solid rgba(56,189,248,0.18)', backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.88), transparent 58%), url('${s.image || '/images/backgrounds/gx.png'}')`, backgroundSize: 'cover', backgroundPosition: 'center', transition: '0.25s' }}>
                          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{s.name.split(' ')[0]}</div>
                            <div style={{ fontSize: 11.5, color: '#cbd5e1', marginBottom: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                            <div style={{ height: 32, borderRadius: 9, background: 'linear-gradient(90deg,#22d3ee,#a855f7)', padding: 1.2 }}><div style={{ height: '100%', background: 'rgba(0,0,0,0.82)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, color: '#fff' }}>اشحن الآن</div></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                {logoUrl? <img src={logoUrl} alt="logo" style={{ height: 140, width: 'auto', margin: '0 auto 20px', filter: 'drop-shadow(0 0 25px rgba(168,85,247,0.5))' }} /> : <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 14, background: 'linear-gradient(90deg,#38bdf8,#a855f7)', WebkitBackgroundClip: 'text', color: 'transparent' }}>GEX ONLINE</h1>}
                <p style={{ color: '#9aa3b8', fontSize: 20 }}>اضغط على أيقونة البحث أو اختر قسم</p>
              </div>
            </div>
          )}
        </main>
        <footer style={{ position: 'relative', zIndex: 10, marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginBottom: 18 }}>
              {socials.map(s => (
                <a key={s.k} href={s.url} target="_blank" style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa3b8', transition: '0.2s' }}>
                  {icons[s.k as keyof typeof icons]('#cbd5e1')}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 18, fontSize: 13 }}>
                <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>الشروط</Link>
                <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>الخصوصية</Link>
                <Link href="/support" style={{ color: '#64748b', textDecoration: 'none' }}>الدعم</Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
                <span>© 2026 جميع الحقوق محفوظة</span>
                <span style={{ fontWeight: 800, color: '#fff' }}>GEX<span style={{ color: '#a855f7' }}>ONLINE</span></span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div dir="rtl" style={{minHeight:'100vh',background:'#020617',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>جاري التحميل...</div>}>
      <HomeContent />
    </Suspense>
  );
}
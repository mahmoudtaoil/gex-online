'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [s, setS] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
     .then(r => r.json())
     .then(data => { setS(data || {}); setLoading(false); });
  }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', `gex-online/settings`);
    fd.append('public_id', field);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setS({...s, [field]: data.url });
    } catch {}
    setUploading(null);
  };

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
    router.push('/admin');
    router.refresh();
  };

  if (loading) return <div style={{ padding: 40, background: '#020617', color: '#fff', minHeight: '100vh' }}>جاري التحميل...</div>;

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>الإعدادات</h1>
          <Link href="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>← رجوع</Link>
        </div>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 16, display: 'grid', gap: 14 }}>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>رقم واتساب</label><input value={s.whatsapp || ''} onChange={e => setS({...s, whatsapp: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>رقم الهاتف</label><input value={s.phone || ''} onChange={e => setS({...s, phone: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>تيليجرام</label><input value={s.telegram || ''} onChange={e => setS({...s, telegram: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>انستغرام</label><input value={s.instagram || ''} onChange={e => setS({...s, instagram: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>تيك توك</label><input value={s.tiktok || ''} onChange={e => setS({...s, tiktok: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>فيسبوك</label><input value={s.facebook || ''} onChange={e => setS({...s, facebook: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>
          <div><label style={{ fontSize: 13, color: '#94a3b8' }}>جيميل</label><input value={s.gmail || ''} onChange={e => setS({...s, gmail: e.target.value})} style={{ width: '100%', padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff', marginTop: 4 }} /></div>

          <div style={{ height: 1, background: '#1e293b', margin: '8px 0' }} />

          {/* اللوغو */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8' }}>رابط اللوغو</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
              <input value={s.logoUrl || ''} onChange={e => setS({...s, logoUrl: e.target.value})} style={{ flex: 1, padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <label style={{ padding: '12px 16px', background: '#7c3aed', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {uploading === 'logoUrl'? '...' : 'رفع'}
                <input type="file" accept="image/*" onChange={e => upload(e, 'logoUrl')} style={{ display: 'none' }} />
              </label>
            </div>
            {s.logoUrl && <img src={s.logoUrl} style={{ height: 40, marginTop: 8, borderRadius: 6 }} />}
          </div>

          {/* خلفية الرئيسية */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8' }}>خلفية الرئيسية</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input value={s.bgHome || ''} onChange={e => setS({...s, bgHome: e.target.value})} style={{ flex: 1, padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <label style={{ padding: '12px 16px', background: '#7c3aed', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                {uploading === 'bgHome'? '...' : 'رفع'}
                <input type="file" accept="image/*" onChange={e => upload(e, 'bgHome')} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* خلفية الخدمة */}
          <div>
            <label style={{ fontSize: 13, color: '#94a3b8' }}>خلفية صفحة الخدمة</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input value={s.bgService || ''} onChange={e => setS({...s, bgService: e.target.value})} style={{ flex: 1, padding: 12, background: '#020617', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <label style={{ padding: '12px 16px', background: '#7c3aed', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                {uploading === 'bgService'? '...' : 'رفع'}
                <input type="file" accept="image/*" onChange={e => upload(e, 'bgService')} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <button onClick={save} style={{ padding: '12px 16px', background: 'linear-gradient(90deg,#8b5cf6,#ec4899)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, marginTop: 8, cursor: 'pointer' }}>حفظ</button>
        </div>
      </div>
    </div>
  )
}
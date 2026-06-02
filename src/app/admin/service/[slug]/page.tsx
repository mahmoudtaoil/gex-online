'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditServicePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug)? params.slug[0] : params.slug as string;
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/service/${slug}`, { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
        if (data &&!Array.isArray(data.packages)) data.packages = [];
        setService(data);
        setLoading(false);
      })
    .catch(() => setLoading(false));
  }, [slug]);

  const updatePkg = (i: number, field: string, val: any) => {
    const pkgs = [...(service.packages || [])];
    pkgs[i] = {...pkgs[i], [field]: val };
    setService({...service, packages: pkgs });
  };

  const addPkg = () => {
    setService({...service, packages: [...(service.packages || []), { name: '', price: 0, isActive: true }]});
  };

  const delPkg = (i: number) => {
    const pkgs = [...(service.packages || [])];
    pkgs.splice(i, 1);
    setService({...service, packages: pkgs });
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file ||!service) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', `gex-online/${service.category || 'misc'}`);
    fd.append('public_id', slug);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setService({...service, image: data.url });
    } catch {}
    setUploading(false);
  };

  const save = async () => {
    const res = await fetch(`/api/service/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        name: service.name,
        image: service.image,
        isActive: service.isActive,
        packages: service.packages || []
      })
    });
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      alert('فشل الحفظ');
    }
  };

  if (loading) return <div style={{ padding: 40, background: '#020617', color: '#fff', minHeight: '100vh' }}>جاري التحميل...</div>;
  if (!service) return <div style={{ padding: 40, color: '#fff', background: '#020617', minHeight: '100vh' }}>الخدمة غير موجودة</div>;

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: 40 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, marginBottom: 20 }}>تعديل: {service.name}</h1>

        <input
          value={service.name || ''}
          onChange={e => setService({...service, name: e.target.value})}
          style={{ width: '100%', padding: 12, marginBottom: 16, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff' }}
        />

        {/* زر تفعيل / ايقاف */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, background: '#0f172a', padding: 14, borderRadius: 8, border: '1px solid #334155' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={service.isActive!== false}
              onChange={e => setService({...service, isActive: e.target.checked})}
              style={{ width: 20, height: 20, accentColor: '#22d3ee' }}
            />
            <span style={{ fontWeight: 600, color: service.isActive!== false? '#22c55e' : '#ef4444' }}>
              {service.isActive!== false? 'الخدمة مفعلة - تظهر للزبائن' : 'الخدمة متوقفة - مخفية'}
            </span>
          </label>
        </div>

        <div style={{ marginBottom: 24, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>صورة الخدمة</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <img src={service.image || '/images/backgrounds/default.jpg'} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, background: '#1e293b', border: '1px solid #334155' }} />
            <div>
              <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} style={{ color: '#fff' }} />
              {uploading && <div style={{ marginTop: 6, color: '#22d3ee', fontSize: 13 }}>جاري الرفع...</div>}
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: 12 }}>الباقات ({(service.packages || []).length})</h3>
        {(service.packages || []).map((pkg: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input value={pkg.name || ''} onChange={e => updatePkg(i, 'name', e.target.value)} placeholder="اسم الباقة" style={{ flex: 1, padding: 10, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff' }} />
            <input type="number" value={pkg.price || 0} onChange={e => updatePkg(i, 'price', Number(e.target.value))} placeholder="السعر" style={{ width: 120, padding: 10, background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#fff' }} />
            <button onClick={() => delPkg(i)} style={{ padding: '0 14px', background: '#dc2626', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>حذف</button>
          </div>
        ))}

        <button onClick={addPkg} style={{ marginTop: 10, padding: '8px 16px', background: '#334155', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>+ إضافة باقة</button>

        <div style={{ marginTop: 30, display: 'flex', gap: 12 }}>
          <button onClick={save} style={{ padding: '12px 30px', background: 'linear-gradient(90deg,#22d3ee,#a855f7)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>حفظ التغييرات</button>
          <button onClick={() => router.back()} style={{ padding: '12px 20px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>رجوع</button>
        </div>
      </div>
    </div>
  );
}
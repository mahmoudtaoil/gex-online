'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: 'games',
    image: '/images/games/default.jpg'
  });
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (!form.name || !form.slug) {
      alert('اكتب الاسم والـ slug');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/service/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false);
    
    if (res.ok) {
      router.push('/admin');
    } else {
      alert('خطأ بالحفظ');
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: 40 }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, marginBottom: 30 }}>خدمة جديدة</h1>
        
        <input 
          placeholder="اسم الخدمة" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
          style={{ width: '100%', padding: 14, marginBottom: 12, background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff' }}
        />
        <input 
          placeholder="slug" 
          value={form.slug} 
          onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
          style={{ width: '100%', padding: 14, marginBottom: 12, background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff' }}
        />
        <select 
          value={form.category} 
          onChange={e => setForm({...form, category: e.target.value})}
          style={{ width: '100%', padding: 14, marginBottom: 20, background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#fff' }}
        >
          <option value="games">ألعاب</option>
          <option value="apps">تطبيقات</option>
          <option value="cards">بطاقات</option>
          <option value="social">سوشيال</option>
          <option value="balance">رصيد</option>
          <option value="subs">اشتراكات</option>
        </select>
        
        <button 
          onClick={save} 
          disabled={loading}
          style={{ padding: '12px 30px', background: '#22d3ee', border: 'none', borderRadius: 10, color: '#000', cursor: 'pointer' }}
        >
          {loading ? 'جاري...' : 'حفظ'}
        </button>
      </div>
    </div>
  );
}
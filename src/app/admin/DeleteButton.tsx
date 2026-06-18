'use client';

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <button
      onClick={async (e) => {
        if (!confirm(`حذف "${name}" نهائياً؟`)) return;
        const res = await fetch(`/api/service/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          (e.target as HTMLElement).closest('tr')?.remove();
        } else {
          alert('فشل الحذف');
        }
      }}
      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13, padding: 0 }}
    >
      حذف
    </button>
  );
}
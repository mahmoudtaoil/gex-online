import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) return { title: 'GEX ONLINE' };
  const title = `شحن ${service.name} - أرخص سعر | GEX ONLINE`;
  const description = `اشحن ${service.name} بأرخص الأسعار في سوريا وتركيا. تسليم فوري عبر ID. شحن ${service.name} مضمون من GEX ONLINE.`;
  const image = service.image?.replace('/upload/', '/upload/f_auto,q_auto/') || '';
  return { title, description, openGraph: { title, description, images: [image], type: 'website' }, twitter: { card: 'summary_large_image', title, description, images: [image] } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  const service = await prisma.service.findUnique({ where: { slug } });
  if (!service) notFound();
  const settings = await getSettings();
  const bgUrl = settings.bgService || settings.bgHome || '/images/backgrounds/gx.png';
  const whatsapp = (settings.whatsapp || '').replace(/[^0-9]/g, '');
  const activePackages = service.packages as any[] || [];

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#020617', color: '#fff', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url('${bgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.85, filter: 'brightness(1)' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.15), rgba(2,6,23,0.4) 80%)' }} />
      <header style={{ position: 'relative', zIndex: 10, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(2,6,23,0.7)', backdropFilter: 'blur(10px)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: 22 }}>GEX<span style={{ color: '#a855f7' }}>ONLINE</span></Link>
      </header>
      <main className="service-main" style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 18 }}>الباقات المتاحة</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {activePackages.map((pkg:any, idx:number) => {
              const text = `مرحبا GEX 👋\nبدي اشحن ${service.name}\nالباقة: ${pkg.name}\nالسعر: ${pkg.price} ₺`;
              const waUrl = whatsapp? `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}` : '#';
              return (
                <div key={idx} className="package-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 18px', background: 'rgba(15,23,42,0.78)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <a href={waUrl} target="_blank" style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '7px 16px', background: '#22c55e', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, color: '#000', cursor: 'pointer' }}>شراء</button>
                    </a>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>{pkg.price} ₺</span>
                  </div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>{pkg.name.includes('💎')? pkg.name : <><span>💎</span>{pkg.name}</>}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="service-image" style={{ position: 'sticky', top: 90, background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(12px)', height: 'fit-content' }}>
          <div style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', marginBottom: 14, background: '#000' }}>
            <img src={service.image?.replace('/upload/', '/upload/f_auto,q_auto/') || ''} alt={service.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 21, margin: 0 }}>{service.name}</h1>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{service.category}</div>
        </div>
      </main>
      <style>{`
        @media (max-width: 768px) {
         .service-main { grid-template-columns: 1fr!important; padding: 20px 12px!important; }
         .service-image { position: relative!important; top: 0!important; order: -1; margin-bottom: 12px; }
         .package-item { flex-direction: row!important; padding: 12px 14px!important; }
        }
      `}</style>
    </div>
  );
}
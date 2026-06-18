import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import { FaTelegramPlane, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const raw = await getSettings().catch(() => null);
  const settings = raw as any;

  const logoUrl = settings?.logoUrl || 'https://res.cloudinary.com/dx7ivska6/image/upload/gex-online/settings/logoUrl.png';

  const ogImage = logoUrl.includes('cloudinary.com')
  ? logoUrl.replace('/upload/', '/upload/w_1200,h_630,c_pad,b_rgb:020617,q_auto,f_auto/')
    : logoUrl;

  return {
    title: 'GEX ONLINE - شحن الألعاب والتطبيقات',
    description: 'أرخص شحن ببجي وفري فاير ونتفلكس',
    metadataBase: new URL('https://gexonline.duckdns.org'),
    openGraph: {
      title: 'GEX ONLINE - شحن الألعاب والتطبيقات',
      description: 'أرخص شحن ببجي وفري فاير ونتفلكس',
      url: 'https://gexonline.duckdns.org',
      siteName: 'GEX ONLINE',
      images: [{ url: ogImage, width: 1200, height: 630, alt: 'GEX ONLINE' }],
      locale: 'ar_SY',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GEX ONLINE',
      description: 'أرخص شحن ببجي وفري فاير ونتفلكس',
      images: [ogImage],
    },
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
  };
}

// عدلت هذا الجزء فقط - استبدلت الـ SVG بـ react-icons
const icons = {
  telegram: <FaTelegramPlane size={20} />,
  instagram: <FaInstagram size={20} />,
  facebook: <FaFacebookF size={20} />,
  tiktok: <FaTiktok size={20} />,
  gmail: <MdEmail size={20} />,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings: any = await getSettings().catch(() => ({}));
  const logoUrl = settings?.logoUrl || 'https://res.cloudinary.com/dx7ivska6/image/upload/gex-online/settings/logoUrl.png';
  const whatsapp = settings?.whatsapp?.replace(/[^0-9]/g, '');

  const socials = [
    { k: 'telegram', url: settings?.telegram, color: '#229ED9' },
    { k: 'instagram', url: settings?.instagram, color: '#E4405F' },
    { k: 'facebook', url: settings?.facebook, color: '#1877F2' },
    { k: 'tiktok', url: settings?.tiktok, color: '#ffffff' },
    { k: 'gmail', url: settings?.gmail? `mailto:${settings.gmail}` : '', color: '#EA4335' },
  ].filter(s => s.url);

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href={logoUrl} type="image/png" sizes="any" />
        <link rel="shortcut icon" href={logoUrl} />
        <link rel="apple-touch-icon" href={logoUrl} />
      </head>
      <body style={{ background: '#020617', color: '#fff', margin: 0 }}>
        {children}

        <footer style={{ position: 'relative', zIndex: 50, marginTop: 60, background: 'linear-gradient(to top, rgba(2,6,23,1), rgba(2,6,23,0.9))', borderTop: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(16px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 24px' }}>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
              {socials.map(s => (
                <a key={s.k} href={s.url} target="_blank" rel="noopener" className="social-neon" style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(10,15,30,0.9)', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, boxShadow: `0 0 20px ${s.color}70, inset 0 0 12px ${s.color}20`, transition: 'all 0.3s', textDecoration: 'none' }}>
                  {icons[s.k as keyof typeof icons]}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 16 }}>

              <div style={{ color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>© 2026 جميع الحقوق محفوظة لدى</span>
                <span style={{ color: '#a855f7', fontWeight: 800, textShadow: '0 0 10px rgba(168,85,247,0.5)' }}>WHJALKAMAR</span>
              </div>

              <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                <Link href="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>الشروط</Link>
                <Link href="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>الخصوصية</Link>
                <Link href="/support" style={{ color: '#64748b', textDecoration: 'none' }}>الدعم</Link>
              </div>

              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1.5px solid #22c55e', borderRadius: 10, color: '#22c55e', textDecoration: 'none', fontWeight: 600, fontSize: 14, boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
                  <span>تواصل واتساب</span>
                  <svg width="18" height="18" fill="#25D366" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L0 24l6.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0z"/></svg>
                </a>
              )}
            </div>
          </div>
        </footer>

        <style>{`
       .social-neon:hover {
            transform: scale(1.1);
            filter: brightness(1.2);
          }
        `}</style>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gexonline.duckdns.org'),
  title: "GEX Online - شحن ألعاب بأرخص سعر",
  description: "اشحن ببجي، فري فاير، جواكر وجميع الألعاب بأرخص الأسعار في سوريا وتركيا. تسليم فوري عبر ID من GEX ONLINE",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#020617] text-white overflow-x-hidden m-0 p-0">
        <main className="flex-1">{children}</main>
        <footer style={{ borderTop: '1px solid #1e293b', padding: 20 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b' }}>
            <div>© {new Date().getFullYear()} GEX</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" style={{ color: '#22c55e' }}>واتساب</a>
              <a href={settings.telegram} target="_blank">تيليجرام</a>
              <a href={settings.instagram} target="_blank">انستغرام</a>
              <a href={settings.facebook} target="_blank">فيسبوك</a>
              <a href={settings.gmail} target="_blank">جيميل</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
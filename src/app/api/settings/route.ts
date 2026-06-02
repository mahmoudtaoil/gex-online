import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await prisma.setting.findFirst({ where: { key: 'main' } });
  return NextResponse.json(settings || {});
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const settings = await prisma.setting.upsert({
      where: { key: 'main' },
      update: {
        whatsapp: data.whatsapp || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        facebook: data.facebook || '',
        gmail: data.gmail || '',
        phone: data.phone || '',
        logoUrl: data.logoUrl || '',
        bgHome: data.bgHome || '',
        bgService: data.bgService || '',
      },
      create: {
        key: 'main',
        whatsapp: data.whatsapp || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        tiktok: data.tiktok || '',
        facebook: data.facebook || '',
        gmail: data.gmail || '',
        phone: data.phone || '',
        logoUrl: data.logoUrl || '',
        bgHome: data.bgHome || '',
        bgService: data.bgService || '',
      }
    });
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
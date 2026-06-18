import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      category: true,
      isActive: true,
    }
  });
  return NextResponse.json(services, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
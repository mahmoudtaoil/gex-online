import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findFirst({
    where: { slug: { equals: slug, mode: 'insensitive' } }
  });
  return NextResponse.json(service);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await req.json();

  const service = await prisma.service.findFirst({
    where: { slug: { equals: slug, mode: 'insensitive' } }
  });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.service.update({
    where: { id: service.id },
    data: {
      name: data.name,
      image: data.image,
      isActive: data.isActive!== false,
      packages: data.packages || []
    }
  });
  return NextResponse.json(updated);
}
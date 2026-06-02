import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        category: data.category || 'games',
        image: data.image || '/images/default.jpg',
        isActive: true,
      }
    });
    
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
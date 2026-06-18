import { prisma } from '@/lib/prisma'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await prisma.service.findMany({ 
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  })
  
  const serviceUrls: MetadataRoute.Sitemap = services.map((service: { slug: string; updatedAt: Date }) => ({
    url: `https://gexonline.duckdns.org/service/${service.slug}`,
    lastModified: service.updatedAt,
  }))

  return [
    { 
      url: 'https://gexonline.duckdns.org', 
      lastModified: new Date() 
    },
    ...serviceUrls,
  ]
}
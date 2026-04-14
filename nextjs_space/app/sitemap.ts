import { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const baseUrl = host.startsWith('http') ? host : `https://${host}`
  
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sholat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/doa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/hadits`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/waris`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/zakat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/umroh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/haji`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/tentang`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}

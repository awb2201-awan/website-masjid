import berita from '@/data/berita.json'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-lathifah.vercel.app'

export default function sitemap() {
  const publicRoutes = [
    '',
    '/berita',
    '/galeri',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))

  const beritaRoutes = berita.map((item) => ({
    url: `${siteUrl}/berita/${item.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...publicRoutes, ...beritaRoutes]
}

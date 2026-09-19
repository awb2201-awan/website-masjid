const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-lathifah.vercel.app'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

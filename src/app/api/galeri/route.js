import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {galeriQuery} from '@/sanity/lib/queries'
import {trustedSanityAssetUrl} from '@/lib/sanity-assets'

export async function GET() {
  try {
    const galeri = await client.fetch(galeriQuery)
    return NextResponse.json(galeri.map((item) => ({
      id: item._id,
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      img: trustedSanityAssetUrl(item.gambar?.asset?.url, '/hero-bg.jpg'),
    })), {
      headers: {'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'},
    })
  } catch (error) {
    console.error('Failed to load galeri from Sanity', error)
    return NextResponse.json({error: 'Data galeri sedang tidak tersedia.'}, {status: 503})
  }
}
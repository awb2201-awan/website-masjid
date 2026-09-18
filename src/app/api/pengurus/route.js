import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {pengurusQuery} from '@/sanity/lib/queries'
import {trustedSanityAssetUrl} from '@/lib/sanity-assets'

export async function GET() {
  try {
    const pengurus = await client.fetch(pengurusQuery)
    return NextResponse.json(pengurus.map((item) => ({
      id: item._id,
      nama: item.nama,
      jabatan: item.jabatan,
      inisial: item.inisial,
      foto: trustedSanityAssetUrl(item.foto?.asset?.url),
    })), {
      headers: {'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'},
    })
  } catch (error) {
    console.error('Failed to load pengurus from Sanity', error)
    return NextResponse.json({error: 'Data pengurus sedang tidak tersedia.'}, {status: 503})
  }
}
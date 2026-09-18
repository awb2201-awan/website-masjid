import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {beritaQuery} from '@/sanity/lib/queries'
import {trustedSanityAssetUrl} from '@/lib/sanity-assets'

function mapBerita(berita) {
  return {
    id: berita._id,
    kategori: berita.kategori,
    judul: berita.judul,
    ringkasan: berita.ringkasan || '',
    tanggal: berita.tanggal
      ? new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(berita.tanggal))
      : '',
    img: trustedSanityAssetUrl(berita.gambar?.asset?.url, '/hero-bg.jpg'),
    isi: berita.isi?.map((block) => block.children?.map((child) => child.text).join('')).filter(Boolean).join('\n\n') || '',
  }
}

export async function GET() {
  try {
    const berita = await client.fetch(beritaQuery)
    return NextResponse.json(berita.map(mapBerita), {
      headers: {'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'},
    })
  } catch (error) {
    console.error('Failed to load berita from Sanity', error)
    return NextResponse.json({error: 'Data berita sedang tidak tersedia.'}, {status: 503})
  }
}
import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {beritaQuery} from '@/sanity/lib/queries'

function mapBerita(berita) {
  return {
    id: berita._id,
    kategori: berita.kategori,
    judul: berita.judul,
    ringkasan: berita.ringkasan || '',
    tanggal: berita.tanggal
      ? new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(berita.tanggal))
      : '',
    img: berita.gambar?.asset?.url || '/hero-bg.jpg',
    isi: berita.isi?.map((block) => block.children?.map((child) => child.text).join('')).filter(Boolean).join('\n\n') || '',
  }
}

export async function GET() {
  const berita = await client.fetch(beritaQuery)
  return NextResponse.json(berita.map(mapBerita))
}
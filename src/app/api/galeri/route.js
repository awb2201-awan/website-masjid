import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {galeriQuery} from '@/sanity/lib/queries'

export async function GET() {
  try {
    const galeri = await client.fetch(galeriQuery)
    return NextResponse.json(galeri.map((item) => ({
      id: item._id,
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      img: item.gambar?.asset?.url || '/hero-bg.jpg',
    })))
  } catch (error) {
    console.error('Failed to load galeri from Sanity', error)
    return NextResponse.json({error: 'Data galeri sedang tidak tersedia.'}, {status: 503})
  }
}
import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {mitraQuery} from '@/sanity/lib/queries'

export async function GET() {
  try {
    const items = await client.fetch(mitraQuery)
    return NextResponse.json(items.map((item) => ({
      id: item._id,
      nama: item.nama,
      inisial: item.inisial,
      logo: item.logo?.asset?.url || '',
    })))
  } catch (error) {
    console.error('Failed to load mitra from Sanity', error)
    return NextResponse.json({error: 'Data mitra sedang tidak tersedia.'}, {status: 503})
  }
}
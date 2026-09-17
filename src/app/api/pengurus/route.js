import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {pengurusQuery} from '@/sanity/lib/queries'

export async function GET() {
  const pengurus = await client.fetch(pengurusQuery)
  return NextResponse.json(pengurus.map((item) => ({
    id: item._id,
    nama: item.nama,
    jabatan: item.jabatan,
    inisial: item.inisial,
    foto: item.foto?.asset?.url || '',
  })))
}
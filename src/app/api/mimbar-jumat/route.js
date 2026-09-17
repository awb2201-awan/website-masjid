import {NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {mimbarJumatQuery} from '@/sanity/lib/queries'

export async function GET() {
  const items = await client.fetch(mimbarJumatQuery)
  return NextResponse.json(items.map((item) => ({
    id: item._id,
    tanggal: item.tanggal ? new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(item.tanggal)) : '',
    khatib: item.khatib,
    judul: item.judul,
    ringkasan: item.ringkasan,
  })))
}
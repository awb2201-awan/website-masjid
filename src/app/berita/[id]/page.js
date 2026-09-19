import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SEMUA_BERITA from '@/data/berita.json'
import {client} from '@/sanity/lib/client'
import {beritaByIdQuery} from '@/sanity/lib/queries'

const WARNA_KATEGORI = {
  'BERITA':     'bg-[#2f9e6f] text-white',
  'KEGIATAN':   'bg-[#c9a84c] text-white',
  'PENGUMUMAN': 'bg-blue-600 text-white',
  'SOSIAL':     'bg-rose-500 text-white',
}

export default async function DetailBeritaPage({ params }) {
  const { id } = await params
  const beritaSanity = await client.fetch(beritaByIdQuery, {id})
  const berita = beritaSanity
    ? {
        id: beritaSanity._id,
        kategori: beritaSanity.kategori,
        judul: beritaSanity.judul,
        tanggal: beritaSanity.tanggal
          ? new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(beritaSanity.tanggal))
          : '',
        img: beritaSanity.gambar?.asset?.url || '/hero-bg.jpg',
        isi: beritaSanity.isi?.map((block) => block.children?.map((child) => child.text).join('')).filter(Boolean).join('\n\n') || beritaSanity.ringkasan,
      }
    : SEMUA_BERITA.find(b => String(b.id) === id)
  if (!berita) return notFound()

  const paragraf = (berita.isi || berita.ringkasan).split('\n\n')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-[#0d3d2b] pt-24 pb-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-start gap-4">
          <Link href="/berita" className="text-[#c9a84c] text-sm hover:underline">
            ← Kembali ke Berita
          </Link>
          <span className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${WARNA_KATEGORI[berita.kategori] || 'bg-gray-600 text-white'}`}>
            {berita.kategori}
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">{berita.judul}</h1>
          <p className="text-white/50 text-sm mt-3">{berita.tanggal}</p>
        </div>
      </div>

      {/* ── GAMBAR ── */}
      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image src={berita.img} alt={berita.judul} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>
      </div>

      {/* ── ISI ── */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="prose max-w-none">
          {paragraf.map((p, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>
          ))}
        </div>

      </div>

      {/* ── FOOTER MINI ── */}
      <div className="bg-[#0d3d2b] py-6 px-6 text-center">
        <p className="text-white/30 text-xs">© 2026 DKM Masjid Lathifah</p>
      </div>

    </div>
  )
}
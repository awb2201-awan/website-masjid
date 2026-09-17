'use client'

import {useEffect, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'

const FALLBACK_GALERI = [
  {id: 'hero', judul: 'Masjid Lathifah', deskripsi: 'Dokumentasi Masjid Lathifah.', img: '/hero-bg.jpg'},
  {id: 'masjid-2', judul: 'Kegiatan Masjid Lathifah', deskripsi: 'Dokumentasi Masjid Lathifah.', img: '/masjid-2.jpg'},
  {id: 'masjid-3', judul: 'Dokumentasi Masjid Lathifah', deskripsi: 'Dokumentasi Masjid Lathifah.', img: '/masjid-3.jpg'},
]

export default function GaleriPage() {
  const [galeri, setGaleri] = useState(FALLBACK_GALERI)

  useEffect(() => {
    fetch('/api/galeri')
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (items.length > 0) setGaleri(items)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#0d3d2b] pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-[#c9a84c] text-sm hover:underline mb-4 inline-block">
            ← Kembali ke Beranda
          </Link>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Dokumentasi</p>
          <h1 className="text-white text-4xl font-bold">Galeri Masjid</h1>
          <p className="text-white/50 text-sm mt-2">Kumpulan foto kegiatan dan suasana Masjid Lathifah</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galeri.map((item, index) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="relative aspect-[4/3] overflow-hidden group">
                <Image
                  src={item.img}
                  alt={item.judul}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized={item.img.startsWith('http')}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {index === 0 && (
                  <span className="absolute top-4 left-4 bg-[#c9a84c] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    TERBARU
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-[#0d3d2b] font-bold text-base">{item.judul}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mt-2">{item.deskripsi}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#0d3d2b] py-6 px-6 text-center">
        <p className="text-white/30 text-xs">© 2026 DKM Masjid Lathifah</p>
      </footer>
    </main>
  )
}
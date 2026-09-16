'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SEMUA_BERITA from '@/data/berita.json'

const WARNA_KATEGORI = {
  'BERITA':       'bg-[#0d3d2b] text-white',
  'KEGIATAN':     'bg-[#c9a84c] text-white',
  'PENGUMUMAN':   'bg-blue-600 text-white',
  'SOSIAL':       'bg-rose-500 text-white',
}

const KATEGORI_LIST = ['Semua', 'Berita', 'Kegiatan', 'Pengumuman', 'Sosial']

export default function BeritaPage() {
  const [filterAktif, setFilterAktif] = useState('Semua')

  const beritaTampil = filterAktif === 'Semua'
    ? SEMUA_BERITA
    : SEMUA_BERITA.filter(b => b.kategori === filterAktif.toUpperCase())

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ── */}
      <div className="bg-[#0d3d2b] pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-[#c9a84c] text-sm hover:underline mb-4 inline-block">
            ← Kembali ke Beranda
          </Link>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Informasi</p>
          <h1 className="text-white text-4xl font-bold">Berita & Pengumuman</h1>
          <p className="text-white/50 text-sm mt-2">Info terkini dari Masjid Lathifah</p>
        </div>
      </div>

      {/* ── FILTER KATEGORI ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          {KATEGORI_LIST.map(k => (
            <button
              key={k}
              onClick={() => setFilterAktif(k)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                filterAktif === k
                  ? 'bg-[#0d3d2b] text-white border-[#0d3d2b]'
                  : 'border-gray-200 text-gray-600 hover:border-[#0d3d2b] hover:text-[#0d3d2b]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST BERITA ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {beritaTampil.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Belum ada berita di kategori ini.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beritaTampil.map(b => (
              <div key={b.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#c9a84c]/30 transition-all group cursor-pointer">
                {/* Gambar */}
                <div className="relative h-48 overflow-hidden">
                  <Image src={b.img} alt={b.judul} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${WARNA_KATEGORI[b.kategori] || 'bg-gray-600 text-white'}`}>
                      {b.kategori}
                    </span>
                  </div>
                </div>
                {/* Konten */}
                <div className="p-5">
                  <p className="text-gray-400 text-xs mb-2">{b.tanggal}</p>
                  <h3 className="text-[#0d3d2b] font-bold text-base leading-snug mb-2 line-clamp-2">
                    {b.judul}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {b.ringkasan}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[#c9a84c] text-sm font-semibold hover:underline">
                      Baca selengkapnya →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER MINI ── */}
      <div className="bg-[#0d3d2b] py-6 px-6 text-center">
        <p className="text-white/30 text-xs">© 2026 DKM Masjid Lathifah</p>
      </div>

    </div>
  )
}
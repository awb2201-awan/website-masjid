import Image from 'next/image'
import Link from 'next/link'

const SEMUA_BERITA = [
  {
    id: 1,
    kategori: 'BERITA',
    judul: 'Renovasi Selesai, Masjid Lathifah Kini Tampil Lebih Megah dan Nyaman',
    ringkasan: 'Setelah melalui proses renovasi selama beberapa bulan, Masjid Lathifah kini hadir dengan wajah baru yang lebih megah dan nyaman untuk seluruh jamaah.',
    tanggal: '10 September 2026',
    img: '/masjid-2.jpg',
  },
  {
    id: 2,
    kategori: 'KEGIATAN',
    judul: 'Kajian Rutin Pekan Ini: Memahami Makna Sabar dalam Kehidupan',
    ringkasan: 'Kajian pekan ini membahas tema sabar yang dibawakan oleh Ustadz Ahmad Fauzi. Kegiatan berlangsung setiap Ahad pagi pukul 07.00 WIB.',
    tanggal: '8 September 2026',
    img: '/masjid-3.jpg',
  },
  {
    id: 3,
    kategori: 'PENGUMUMAN',
    judul: 'Jadwal Imam dan Khatib Sholat Jumat Bulan Ini',
    ringkasan: 'DKM Masjid Lathifah mengumumkan jadwal imam dan khatib untuk sholat Jumat bulan September 2026. Silakan dicatat dan disebarluaskan.',
    tanggal: '5 September 2026',
    img: '/hero-bg.jpg',
  },
  {
    id: 4,
    kategori: 'SOSIAL',
    judul: 'Santunan Anak Yatim: Terkumpul Rp 12 Juta dari Jamaah',
    ringkasan: 'Alhamdulillah, kegiatan santunan anak yatim yang diadakan DKM Masjid Lathifah berhasil mengumpulkan dana sebesar Rp 12 juta dari para jamaah.',
    tanggal: '1 September 2026',
    img: '/masjid-2.jpg',
  },
  {
    id: 5,
    kategori: 'KEGIATAN',
    judul: 'TPA Lathifah Buka Pendaftaran Santri Baru Tahun Ajaran 2026',
    ringkasan: 'TPA Masjid Lathifah membuka pendaftaran santri baru untuk tahun ajaran 2026. Pendaftaran dibuka mulai 1 hingga 30 Oktober 2026.',
    tanggal: '28 Agustus 2026',
    img: '/masjid-3.jpg',
  },
  {
    id: 6,
    kategori: 'PENGUMUMAN',
    judul: 'Pengurus DKM Lathifah Periode 2026-2028 Resmi Dilantik',
    ringkasan: 'Pengurus DKM Masjid Lathifah periode 2026-2028 resmi dilantik dalam acara yang dihadiri oleh tokoh masyarakat dan jamaah setempat.',
    tanggal: '20 Agustus 2026',
    img: '/hero-bg.jpg',
  },
]

const WARNA_KATEGORI = {
  'BERITA':       'bg-[#0d3d2b] text-white',
  'KEGIATAN':     'bg-[#c9a84c] text-white',
  'PENGUMUMAN':   'bg-blue-600 text-white',
  'SOSIAL':       'bg-rose-500 text-white',
}

export default function BeritaPage() {
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
          {['Semua', 'Berita', 'Kegiatan', 'Pengumuman', 'Sosial'].map(k => (
            <span key={k}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-[#0d3d2b] hover:text-[#0d3d2b] cursor-pointer transition-colors first:bg-[#0d3d2b] first:text-white first:border-[#0d3d2b]">
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* ── LIST BERITA ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEMUA_BERITA.map(b => (
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
      </div>

      {/* ── FOOTER MINI ── */}
      <div className="bg-[#0d3d2b] py-6 px-6 text-center">
        <p className="text-white/30 text-xs">© 2026 DKM Masjid Lathifah</p>
      </div>

    </div>
  )
}
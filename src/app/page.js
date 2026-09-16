'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const JADWAL = [
  { nama: 'Subuh',   waktu: '04.28' },
  { nama: 'Dzuhur',  waktu: '11.54' },
  { nama: 'Ashar',   waktu: '15.12' },
  { nama: 'Maghrib', waktu: '17.52' },
  { nama: 'Isya',    waktu: '19.04' },
]

const LAYANAN = [
  { icon: '🕌', judul: 'Sholat Berjamaah',  desc: 'Lima waktu setiap hari, terbuka untuk seluruh jamaah.' },
  { icon: '📖', judul: 'Kajian & Pengajian', desc: 'Rutin setiap pekan, berbagai tema ilmu agama.' },
  { icon: '👶', judul: 'TPA / TPQ',          desc: 'Bimbingan Al-Qur\'an untuk anak-anak di lingkungan masjid.' },
  { icon: '❤️', judul: 'Sosial & Zakat',     desc: 'Pengelolaan zakat, infaq, sedekah, dan santunan dhuafa.' },
]

const BERITA = [
  {
    id: 1,
    featured: true,
    kategori: 'BERITA',
    judul: 'Renovasi Selesai, Masjid Lathifah Kini Tampil Lebih Megah dan Nyaman',
    ringkasan: 'Setelah melalui proses renovasi selama beberapa bulan, Masjid Lathifah kini hadir dengan wajah baru yang lebih megah dan nyaman untuk seluruh jamaah.',
    img: '/masjid-2.jpg',
  },
  {
    id: 2,
    featured: false,
    kategori: 'KEGIATAN',
    judul: 'Kajian Rutin Pekan Ini: Memahami Makna Sabar dalam Kehidupan',
    img: '/masjid-3.jpg',
  },
  {
    id: 3,
    featured: false,
    kategori: 'PENGUMUMAN',
    judul: 'Jadwal Imam dan Khatib Sholat Jumat Bulan Ini',
    img: '/hero-bg.jpg',
  },
  {
    id: 4,
    featured: false,
    kategori: 'SOSIAL',
    judul: 'Santunan Anak Yatim: Terkumpul Rp 12 Juta dari Jamaah',
    img: '/masjid-2.jpg',
  },
]

const MITRA = [
  { nama: 'RT 01', inisial: 'RT01' },
  { nama: 'RT 02', inisial: 'RT02' },
  { nama: 'RT 03', inisial: 'RT03' },
  { nama: 'Kelurahan', inisial: 'KEL' },
  { nama: 'Puskesmas', inisial: 'PKM' },
  { nama: 'BMT Sejahtera', inisial: 'BMT' },
  { nama: 'Madrasah Al-Hikmah', inisial: 'MDR' },
  { nama: 'BAZNAS', inisial: 'BZN' },
]

// ── DATA BARU: MIMBAR JUMAT ──
const MIMBAR_JUMAT = [
  {
    tanggal: '19 September 2026',
    khatib: 'Ustadz Ahmad Fauzi',
    judul: 'Menjaga Ukhuwah di Tengah Perbedaan',
    ringkasan: 'Khutbah membahas pentingnya menjaga persaudaraan sesama muslim meski berbeda pandangan, serta adab menyikapi perbedaan dengan akhlak yang baik.',
  },
  {
    tanggal: '12 September 2026',
    khatib: 'Ustadz Muhammad Ridwan',
    judul: 'Syukur sebagai Kunci Ketenangan Hati',
    ringkasan: 'Membahas makna syukur dalam kehidupan sehari-hari dan bagaimana rasa syukur dapat mendatangkan ketenangan serta keberkahan hidup.',
  },
  {
    tanggal: '5 September 2026',
    khatib: 'Ustadz Ahmad Fauzi',
    judul: 'Meneladani Akhlak Rasulullah dalam Bermasyarakat',
    ringkasan: 'Mengupas contoh akhlak Rasulullah SAW dalam berinteraksi dengan tetangga dan masyarakat sebagai teladan hidup bersosial yang baik.',
  },
]

// ── DATA BARU: PENGURUS DKM ──
const PENGURUS = [
  { nama: 'H. Sulaiman Effendi', jabatan: 'Ketua DKM', inisial: 'SE' },
  { nama: 'Drs. Bambang Wijaya', jabatan: 'Wakil Ketua', inisial: 'BW' },
  { nama: 'Ahmad Yusuf, S.Pd', jabatan: 'Sekretaris', inisial: 'AY' },
  { nama: 'Hj. Siti Rahmawati', jabatan: 'Bendahara', inisial: 'SR' },
]

function Navbar({ onDonasi }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d3d2b]/95 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Masjid Lathifah" width={44} height={44} className="rounded-full" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Masjid Lathifah</p>
            <p className="text-[#c9a84c] text-xs">DKM Lathifah</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Beranda','Jadwal','Tentang','Layanan','Berita','Galeri'].map(m => (
            <a key={m} href={`#${m.toLowerCase()}`}
               className="text-white/80 hover:text-[#c9a84c] text-sm font-medium transition-colors">
              {m}
            </a>
          ))}
          <button onClick={onDonasi}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
            Donasi
          </button>
        </div>
      </div>
    </nav>
  )
}

// ── SECTION BARU: JADWAL SHOLAT (standalone, clean) ──
function SectionJadwal() {
  const [jam, setJam] = useState('')
  const [tanggal, setTanggal] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setJam(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setTanggal(now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="jadwal" className="bg-[#0d3d2b] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Waktu Ibadah</p>
          <h2 className="text-white text-3xl font-bold mb-2">Jadwal Sholat Hari Ini</h2>
          <p className="text-white/50 text-sm">{tanggal} — <span className="text-[#c9a84c] font-mono">{jam}</span></p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {JADWAL.map(j => (
            <div key={j.nama}
              className="bg-white/5 border border-[#c9a84c]/20 rounded-2xl py-6 text-center hover:border-[#c9a84c]/50 transition-colors">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">{j.nama}</p>
              <p className="text-white font-bold text-xl">{j.waktu}</p>
              <p className="text-[#c9a84c] text-xs mt-1">WIB</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DonasiOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
           onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-[#0d3d2b] flex items-center justify-center mx-auto mb-4">
          <span className="text-[#c9a84c] text-xl">🕌</span>
        </div>
        <h3 className="text-[#0d3d2b] font-bold text-xl mb-1">Infaq & Sedekah</h3>
        <p className="text-gray-500 text-sm mb-5">Scan QRIS di bawah untuk berdonasi</p>
        <div className="bg-gray-100 rounded-2xl h-52 flex items-center justify-center mb-5">
          <div className="text-center">
            <p className="text-4xl mb-2">📱</p>
            <p className="text-gray-400 text-sm">Gambar QRIS</p>
            <p className="text-gray-300 text-xs">Taruh file qris.png di /public</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">Jazakumullah khairan atas kebaikan Bapak/Ibu</p>
        <button onClick={onClose}
          className="w-full bg-[#0d3d2b] hover:bg-[#0a2e21] text-white font-semibold py-3 rounded-xl transition-colors">
          Tutup
        </button>
      </div>
    </div>
  )
}

// ── SECTION BARU: MIMBAR JUMAT ──
function SectionMimbarJumat() {
  return (
    <section id="mimbar-jumat" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Khutbah Jumat</p>
        <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Mimbar Jumat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MIMBAR_JUMAT.map((m, i) => (
            <div key={i}
              className={`rounded-2xl p-6 border transition-all ${
                i === 0
                  ? 'bg-[#0d3d2b] border-[#0d3d2b] text-white'
                  : 'bg-gray-50 border-gray-100 hover:border-[#c9a84c]/30'
              }`}>
              {i === 0 && (
                <span className="inline-block bg-[#c9a84c] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3">
                  JUMAT TERDEKAT
                </span>
              )}
              <p className={`text-xs mb-2 ${i === 0 ? 'text-white/50' : 'text-gray-400'}`}>{m.tanggal}</p>
              <h3 className={`font-bold text-base leading-snug mb-2 ${i === 0 ? 'text-white' : 'text-[#0d3d2b]'}`}>
                {m.judul}
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${i === 0 ? 'text-white/70' : 'text-gray-500'}`}>
                {m.ringkasan}
              </p>
              <div className={`pt-3 border-t ${i === 0 ? 'border-white/10' : 'border-gray-100'}`}>
                <p className={`text-xs uppercase tracking-widest mb-0.5 ${i === 0 ? 'text-[#c9a84c]' : 'text-[#c9a84c]'}`}>Khatib</p>
                <p className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-[#0d3d2b]'}`}>{m.khatib}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SECTION BARU: PROFIL PENGURUS DKM ──
function SectionPengurus() {
  return (
    <section id="pengurus" className="bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Struktur Organisasi</p>
        <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Pengurus DKM Lathifah</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {PENGURUS.map(p => (
            <div key={p.nama} className="text-center group">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#0d3d2b] flex items-center justify-center mb-4 border-4 border-white shadow-md group-hover:border-[#c9a84c]/40 transition-colors">
                <span className="text-[#c9a84c] font-extrabold text-xl">{p.inisial}</span>
              </div>
              <p className="font-bold text-[#0d3d2b] text-sm leading-snug">{p.nama}</p>
              <p className="text-gray-400 text-xs mt-1">{p.jabatan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionBerita() {
  const featured = BERITA.find(b => b.featured)
  const smalls   = BERITA.filter(b => !b.featured)
  return (
    <section id="berita" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Informasi</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold">Berita Terbaru</h2>
          </div>
          <a href="/berita" className="text-[#0d3d2b] text-sm font-semibold hover:text-[#c9a84c] transition-colors">
            Semua Berita →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featured && (
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-80 group cursor-pointer">
              <Image src={featured.img} alt={featured.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                  {featured.kategori}
                </span>
                <h3 className="text-white font-bold text-lg leading-snug mb-2">{featured.judul}</h3>
                <p className="text-white/70 text-sm line-clamp-2">{featured.ringkasan}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {smalls.map(b => (
              <div key={b.id} className="relative rounded-2xl overflow-hidden h-[calc((320px-16px)/3)] group cursor-pointer flex-1">
                <Image src={b.img} alt={b.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="bg-[#c9a84c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">
                    {b.kategori}
                  </span>
                  <p className="text-white font-semibold text-sm line-clamp-2 leading-snug">{b.judul}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionMitra() {
  return (
    <section className="bg-gray-50 py-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <p className="text-[#0d3d2b]/40 text-xs uppercase tracking-widest font-bold">Mitra & Kolaborasi</p>
      </div>
      <div className="relative">
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite] w-max">
          {[...MITRA, ...MITRA].map((m, i) => (
            <div key={i}
              className="flex-shrink-0 w-32 h-16 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 px-3">
              <span className="text-[#0d3d2b] font-extrabold text-sm">{m.inisial}</span>
              <span className="text-gray-400 text-[10px] text-center leading-tight">{m.nama}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [showDonasi, setShowDonasi] = useState(false)

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <Navbar onDonasi={() => setShowDonasi(true)} />
      {showDonasi && <DonasiOverlay onClose={() => setShowDonasi(false)} />}

      {/* ── HERO (sekarang full teks, tanpa card jadwal) ── */}
      <section id="beranda" className="relative min-h-screen flex items-center">
        <Image src="/hero-bg.jpg" alt="Masjid Lathifah" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-[#0d3d2b]/65" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="max-w-2xl">
            <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <p className="text-white/60 text-sm tracking-widest uppercase mb-4">Selamat Datang di</p>
            <h1 className="text-white text-5xl lg:text-7xl font-extrabold leading-tight mb-2">Masjid</h1>
            <h1 className="text-[#c9a84c] text-5xl lg:text-7xl font-extrabold leading-tight mb-6">Lathifah</h1>
            <p className="text-white/70 text-base max-w-md leading-relaxed mb-8">
              Ruang digital untuk mengenal masjid, melihat jadwal ibadah, serta mengikuti
              informasi dan kegiatan Masjid Lathifah.
            </p>
            <div className="flex gap-4">
              <a href="#tentang" className="bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Kenal Masjid
              </a>
              <a href="#jadwal" className="border border-white/40 hover:border-white text-white font-semibold px-6 py-3 rounded-full transition-colors">
                Lihat Jadwal Sholat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🕌', judul: 'Tentang Masjid', sub: 'Profil & informasi', href: '#tentang' },
            { icon: '📅', judul: 'Kegiatan',        sub: 'Agenda & program',   href: '#layanan' },
            { icon: '📰', judul: 'Berita',           sub: 'Info terkini',       href: '#berita' },
          ].map(item => (
            <a key={item.judul} href={item.href}
               className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-[#c9a84c]/40 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#0d3d2b]/10 flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0d3d2b] text-sm">{item.judul}</p>
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
              <span className="text-gray-300 group-hover:text-[#c9a84c] transition-colors">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section id="tentang" className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Tentang Kami</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Masjid Lathifah</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Masjid Lathifah adalah masjid yang berlokasi di lingkungan perumahan, menjadi
                pusat kegiatan ibadah dan sosial masyarakat setempat. Dikelola oleh Dewan
                Kemakmuran Masjid (DKM) Lathifah, masjid ini terbuka untuk seluruh jamaah.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Dengan fasilitas yang terus dikembangkan, Masjid Lathifah hadir untuk melayani
                kebutuhan ibadah dan kegiatan keagamaan warga sekitar setiap harinya.
              </p>
            </div>
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/masjid-2.jpg" alt="Masjid Lathifah" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section id="layanan" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Layanan Kami</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Kegiatan & Fasilitas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAYANAN.map(l => (
              <div key={l.judul} className="p-6 border border-gray-100 rounded-2xl hover:border-[#c9a84c]/30 hover:shadow-sm transition-all">
                <div className="text-3xl mb-4">{l.icon}</div>
                <h3 className="font-bold text-[#0d3d2b] mb-2">{l.judul}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MIMBAR JUMAT ── */}
      <SectionMimbarJumat />

      {/* ── BERITA ── */}
      <SectionBerita />

      {/* ── GALERI ── */}
      <section id="galeri" className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Galeri</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Dokumentasi Masjid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['/hero-bg.jpg', '/masjid-2.jpg', '/masjid-3.jpg'].map((src, i) => (
              <div key={i} className="relative h-56 rounded-2xl overflow-hidden group">
                <Image src={src} alt={`Foto masjid ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JADWAL SHOLAT (section sendiri) ── */}
      <SectionJadwal />

      {/* ── PENGURUS DKM ── */}
      <SectionPengurus />


      {/* ── MITRA ── */}
      <SectionMitra />


      {/* ── FOOTER ── */}
      <footer className="bg-[#0d3d2b] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Logo" width={36} height={36} className="rounded-full" />
              <p className="font-bold">Masjid Lathifah</p>
            </div>
            <p className="text-white/50 text-sm max-w-xs">Pusat ibadah dan kegiatan keagamaan masyarakat.</p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-[#c9a84c]">Kontak</p>
            <p className="text-white/60 text-sm">Jl. [Alamat Masjid]</p>
            <p className="text-white/60 text-sm">Jakarta</p>
          </div>
          <div>
            <p className="font-semibold mb-3 text-[#c9a84c]">Menu</p>
            {['Beranda','Jadwal','Tentang','Layanan','Berita','Galeri'].map(m => (
              <a key={m} href={`#${m.toLowerCase()}`}
                 className="block text-white/60 hover:text-white text-sm mb-1 transition-colors">{m}</a>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-8 pt-6 text-center text-white/30 text-xs">
          © 2026 DKM Masjid Lathifah. Semua hak dilindungi.
        </div>
      </footer>
    </>
  )
}
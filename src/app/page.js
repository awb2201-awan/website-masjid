'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import JADWAL_FALLBACK from '@/data/jadwal.json'
import MITRA from '@/data/mitra.json'
import MIMBAR_JUMAT from '@/data/mimbar-jumat.json'
import PENGURUS from '@/data/pengurus.json'
import BERITA_ALL from '@/data/berita.json'

const LAYANAN = [
  { icon: '🕌', judul: 'Sholat Berjamaah',  desc: 'Lima waktu setiap hari, terbuka untuk seluruh jamaah.' },
  { icon: '📖', judul: 'Kajian & Pengajian', desc: 'Rutin setiap pekan, berbagai tema ilmu agama.' },
  { icon: '👶', judul: 'TPA / TPQ',          desc: 'Bimbingan Al-Qur\'an untuk anak-anak di lingkungan masjid.' },
  { icon: '❤️', judul: 'Sosial & Zakat',     desc: 'Pengelolaan zakat, infaq, sedekah, dan santunan dhuafa.' },
]

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/4qac5V8LgmyhVQk87'
const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps?q=-6.4231169,106.8405725&output=embed'

/* ── HELPER: animasi muncul pas discroll ── */
function Reveal({ children, delay = 0 }) {
  const elRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (elRef.current) obs.observe(elRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={elRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  )
}

/* ── HELPER: pattern dekoratif islami ── */
function IslamicPattern({ className = '' }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-star" width="60" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M30 5 L38 22 L55 22 L41 33 L47 50 L30 39 L13 50 L19 33 L5 22 L22 22 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
  )
}

function Navbar({ onDonasi }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const MENU = ['Beranda','Jadwal','Tentang','Layanan','Berita','Galeri','Lokasi']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'bg-[#0d3d2b]/95 backdrop-blur shadow-lg' : 'bg-[#0d3d2b]/40 backdrop-blur-md'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Masjid Lathifah" width={44} height={44} className="rounded-full" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Masjid Lathifah</p>
            <p className="text-[#c9a84c] text-xs">DKM Lathifah</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {MENU.map(m => (
            <a key={m} href={`#${m.toLowerCase()}`}
               className="text-white/100 hover:text-[#c9a84c] text-lg font-medium transition-colors">
              {m}
            </a>
          ))}
          <button onClick={onDonasi}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg shadow-[#c9a84c]/20 hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:scale-105 transition-all duration-300">
            Donasi
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Buka menu"
        >
          {menuOpen ? (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-4 flex flex-col gap-1">
          {MENU.map(m => (
            <a key={m} href={`#${m.toLowerCase()}`}
               onClick={() => setMenuOpen(false)}
               className="text-white/90 hover:text-[#c9a84c] text-base font-medium py-2.5 border-b border-white/10 transition-colors">
              {m}
            </a>
          ))}
          <button onClick={() => { onDonasi(); setMenuOpen(false) }}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors mt-3">
            Donasi
          </button>
        </div>
      </div>
    </nav>
  )
}

function SectionJadwal() {
  const [jam, setJam] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [timings, setTimings] = useState(null)
  const [hijri, setHijri] = useState(null)
  const [status, setStatus] = useState('loading')
  const [nextInfo, setNextInfo] = useState(null)

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

  useEffect(() => {
    if (!navigator.geolocation) {
      queueMicrotask(() => setStatus('denied'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const today = new Date()
          const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`
          const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=20`)
          const json = await res.json()
          const t = json.data.timings
          setTimings({
            Subuh: t.Fajr,
            Dzuhur: t.Dhuhr,
            Ashar: t.Asr,
            Maghrib: t.Maghrib,
            Isya: t.Isha,
          })
          setHijri(json.data.date.hijri)
          setStatus('ok')
        } catch (e) {
          setStatus('error')
        }
      },
      () => setStatus('denied'),
      { timeout: 8000 }
    )
  }, [])

  useEffect(() => {
    const sumber = timings || Object.fromEntries(JADWAL_FALLBACK.map(j => [j.nama, j.waktu.replace('.', ':')]))
    const urutan = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya']

    const hitung = () => {
      const now = new Date()
      let target = null
      let nama = null
      for (const n of urutan) {
        const [h, m] = sumber[n].split(':').map(Number)
        const waktu = new Date(now)
        waktu.setHours(h, m, 0, 0)
        if (waktu > now) {
          target = waktu
          nama = n
          break
        }
      }
      if (!target) {
        const [h, m] = sumber['Subuh'].split(':').map(Number)
        target = new Date(now)
        target.setDate(target.getDate() + 1)
        target.setHours(h, m, 0, 0)
        nama = 'Subuh'
      }
      const diff = target - now
      setNextInfo({
        nama,
        jamSisa: Math.floor(diff / 3600000),
        menitSisa: Math.floor((diff % 3600000) / 60000),
        detikSisa: Math.floor((diff % 60000) / 1000),
      })
    }

    hitung()
    const id = setInterval(hitung, 1000)
    return () => clearInterval(id)
  }, [timings])

  const dataTampil = timings
    ? Object.entries(timings).map(([nama, waktu]) => ({ nama, waktu: waktu.replace(':', '.') }))
    : JADWAL_FALLBACK

  return (
    <section id="jadwal" className="relative bg-[#0d3d2b] py-16 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#c9a84c] opacity-[0.04]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <div className="text-center mb-6">
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Waktu Ibadah</p>
            <h2 className="text-white text-3xl font-bold mb-2">Jadwal Sholat Hari Ini</h2>
            <p className="text-white/50 text-sm">
              {tanggal} — <span className="text-[#c9a84c] font-mono">{jam}</span>
            </p>
            {hijri && (
              <p className="text-white/40 text-xs mt-1">
                {hijri.day} {hijri.month.en} {hijri.year} H
              </p>
            )}
            {status === 'denied' && (
              <p className="text-yellow-400/70 text-xs mt-2">
                Lokasi tidak diizinkan — menampilkan jadwal default. Izinkan akses lokasi untuk jadwal akurat sesuai posisi Anda.
              </p>
            )}
            {status === 'error' && (
              <p className="text-yellow-400/70 text-xs mt-2">
                Gagal mengambil jadwal online — menampilkan jadwal default.
              </p>
            )}
          </div>

          {nextInfo && (
            <div className="text-center mb-8">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Menuju {nextInfo.nama}</p>
              <p className="text-[#c9a84c] font-mono text-2xl font-bold">
                {String(nextInfo.jamSisa).padStart(2, '0')}:{String(nextInfo.menitSisa).padStart(2, '0')}:{String(nextInfo.detikSisa).padStart(2, '0')}
              </p>
            </div>
          )}
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {dataTampil.map((j, i) => {
            const aktif = nextInfo && nextInfo.nama === j.nama
            return (
              <Reveal key={j.nama} delay={i * 80}>
                <div
                  className={`rounded-2xl py-6 text-center border transition-all duration-300 hover:-translate-y-1 ${
                    aktif
                      ? 'bg-[#c9a84c]/20 border-[#c9a84c] shadow-lg shadow-[#c9a84c]/20'
                      : 'bg-white/5 border-[#c9a84c]/20 hover:border-[#c9a84c]/50 hover:bg-white/10'
                  }`}>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-2">{j.nama}</p>
                  <p className="text-white font-bold text-xl">{j.waktu}</p>
                  <p className="text-[#c9a84c] text-xs mt-1">WIB</p>
                </div>
              </Reveal>
            )
          })}
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

function SectionMimbarJumat() {
  const [mimbar, setMimbar] = useState(MIMBAR_JUMAT)

  useEffect(() => {
    fetch('/api/mimbar-jumat')
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (items.length > 0) setMimbar(items)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="mimbar-jumat" className="relative bg-white py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.025]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Khutbah Jumat</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Mimbar Jumat</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mimbar.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  i === 0
                    ? 'bg-[#0d3d2b] border-[#0d3d2b] text-white shadow-xl shadow-[#0d3d2b]/20'
                    : 'bg-gray-50 border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-lg'
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
                  <p className="text-xs uppercase tracking-widest mb-0.5 text-[#c9a84c]">Khatib</p>
                  <p className={`text-sm font-semibold ${i === 0 ? 'text-white' : 'text-[#0d3d2b]'}`}>{m.khatib}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionPengurus() {
  const [pengurus, setPengurus] = useState(PENGURUS)

  useEffect(() => {
    fetch('/api/pengurus')
      .then((response) => response.ok ? response.json() : [])
      .then((pengurusSanity) => {
        if (pengurusSanity.length > 0) setPengurus(pengurusSanity)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="pengurus" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Struktur Organisasi</p>
          <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Pengurus DKM Lathifah</h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {pengurus.map((p, i) => (
            <Reveal key={p.nama} delay={i * 80}>
              <div className="text-center group">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-[#0d3d2b] flex items-center justify-center mb-4 border-4 border-white shadow-md group-hover:shadow-xl group-hover:border-[#c9a84c]/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {p.foto ? (
                    <Image src={p.foto} alt={p.nama} fill unoptimized className="object-cover" />
                  ) : (
                    <span className="text-[#c9a84c] font-extrabold text-xl">{p.inisial}</span>
                  )}
                </div>
                <p className="font-bold text-[#0d3d2b] text-sm leading-snug">{p.nama}</p>
                <p className="text-gray-400 text-xs mt-1">{p.jabatan}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionBerita() {
  const [semuaBerita, setSemuaBerita] = useState(BERITA_ALL)

  useEffect(() => {
    fetch('/api/berita')
      .then((response) => response.ok ? response.json() : [])
      .then((beritaSanity) => {
        if (beritaSanity.length > 0) setSemuaBerita(beritaSanity)
      })
      .catch(() => {})
  }, [])

  const featured = semuaBerita[0]
  const smalls   = semuaBerita.slice(1, 4)
  return (
    <section id="berita" className="relative bg-white py-20 px-6 overflow-hidden">
      <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.025]" />
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Informasi</p>
              <h2 className="text-[#0d3d2b] text-3xl font-bold">Berita Terbaru</h2>
            </div>
            <Link href="/berita" className="text-[#0d3d2b] text-sm font-semibold hover:text-[#c9a84c] transition-colors">
              Semua Berita →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featured && (
            <Reveal>
              <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-80 group cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300">
                <Image src={featured.img} alt={featured.judul} fill sizes="(min-width: 1024px) 66vw, 100vw" unoptimized={featured.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                    {featured.kategori}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-snug mb-2">{featured.judul}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">{featured.ringkasan}</p>
                </div>
              </div>
            </Reveal>
          )}

          <div className="flex flex-col gap-4">
            {smalls.map((b, i) => (
              <Reveal key={b.id} delay={i * 100}>
                <div className="relative rounded-2xl overflow-hidden h-[calc((320px-16px)/3)] group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <Image src={b.img} alt={b.judul} fill sizes="(min-width: 1024px) 33vw, 100vw" unoptimized={b.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="bg-[#c9a84c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">
                      {b.kategori}
                    </span>
                    <p className="text-white font-semibold text-sm line-clamp-2 leading-snug">{b.judul}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionMitra() {
  const [mitra, setMitra] = useState(MITRA)

  useEffect(() => {
    fetch('/api/mitra')
      .then((response) => response.ok ? response.json() : [])
      .then((items) => {
        if (items.length > 0) setMitra(items)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="bg-gray-50 py-12 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <p className="text-[#0d3d2b]/40 text-xs uppercase tracking-widest font-bold">Mitra & Kolaborasi</p>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />
        <div className="flex gap-6 animate-[marquee_20s_linear_infinite] w-max">
          {[...mitra, ...mitra].map((m, i) => (
            <div key={i}
              className="flex-shrink-0 w-32 h-16 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c9a84c]/30 transition-all flex flex-col items-center justify-center gap-1 px-3">
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
  const [galeri, setGaleri] = useState([
    {id: 'hero', judul: 'Masjid Lathifah', img: '/hero-bg.jpg'},
    {id: 'masjid-2', judul: 'Masjid Lathifah', img: '/masjid-2.jpg'},
    {id: 'masjid-3', judul: 'Masjid Lathifah', img: '/masjid-3.jpg'},
  ])

  useEffect(() => {
    fetch('/api/galeri')
      .then((response) => response.ok ? response.json() : [])
      .then((galeriSanity) => {
        if (galeriSanity.length > 0) setGaleri(galeriSanity)
      })
      .catch(() => {})
  }, [])

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

      {/* ── HERO ── */}
      <section id="beranda" className="relative min-h-screen flex items-center">
        <Image src="/hero-bg.jpg" alt="Masjid Lathifah" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d2b]/95 via-[#0d3d2b]/70 to-[#0d3d2b]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d2b]/90 via-transparent to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[#c9a84c] text-sm tracking-widest uppercase mb-3">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              <p className="text-white/60 text-sm tracking-widest uppercase mb-4">Selamat Datang di</p>
              <h1 className="text-white text-5xl lg:text-7xl font-extrabold leading-tight mb-2">Masjid</h1>
              <h1 className="text-[#c9a84c] text-5xl lg:text-7xl font-extrabold leading-tight mb-6">Lathifah</h1>
              <p className="text-white/70 text-base max-w-md leading-relaxed mb-8">
                Ruang digital untuk mengenal masjid, melihat jadwal ibadah, serta mengikuti
                informasi dan kegiatan Masjid Lathifah.
              </p>
              <div className="flex gap-4">
                <a href="#tentang" className="bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#c9a84c]/30 hover:shadow-xl hover:shadow-[#c9a84c]/40 hover:scale-105 transition-all duration-300">
                  Kenal Masjid
                </a>
                <a href="#jadwal" className="border border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold px-5 sm:px-6 py-3 rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300 text-center">
                  Lihat Jadwal Sholat
                </a>
              </div>
            </Reveal>
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
          ].map((item, i) => (
            <Reveal key={item.judul} delay={i * 100}>
              <a href={item.href}
                 className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-[#c9a84c]/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#0d3d2b]/10 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#c9a84c]/20 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0d3d2b] text-sm">{item.judul}</p>
                  <p className="text-gray-400 text-xs">{item.sub}</p>
                </div>
                <span className="text-gray-300 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section id="tentang" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Tentang Kami</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Masjid Lathifah</h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
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
            </Reveal>
            <Reveal delay={150}>
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <Image src="/masjid-2.jpg" alt="Masjid Lathifah" fill className="object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── LAYANAN ── */}
      <section id="layanan" className="relative bg-white py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Layanan Kami</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold mb-10">Kegiatan & Fasilitas</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAYANAN.map((l, i) => (
              <Reveal key={l.judul} delay={i * 100}>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl hover:border-[#c9a84c]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{l.icon}</div>
                  <h3 className="font-bold text-[#0d3d2b] mb-2">{l.judul}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{l.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MIMBAR JUMAT ── */}
      <SectionMimbarJumat />

      {/* ── BERITA ── */}
      <SectionBerita />

      {/* ── GALERI ── */}
      <section id="galeri" className="relative bg-gray-50 py-20 px-6 overflow-hidden">
        <IslamicPattern className="inset-0 text-[#0d3d2b] opacity-[0.03]" />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Galeri</p>
                <h2 className="text-[#0d3d2b] text-3xl font-bold">Dokumentasi Masjid</h2>
              </div>
              <Link href="/galeri" className="text-[#0d3d2b] text-sm font-semibold hover:text-[#c9a84c] transition-colors whitespace-nowrap">
                Lihat Semua →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeri.slice(0, 3).map((item, i) => (
              <Reveal key={item.id} delay={i * 100}>
                <div className="relative h-56 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <Image src={item.img} alt={item.judul || `Foto masjid ${i+1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" unoptimized={item.img.startsWith('http')} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── JADWAL SHOLAT ── */}
      <SectionJadwal />

      {/* ── PENGURUS DKM ── */}
      <SectionPengurus />

      {/* ── MITRA ── */}
      <SectionMitra />

      {/* ── LOKASI ── */}
      <section id="lokasi" className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-[#c9a84c] text-sm uppercase tracking-widest mb-2">Lokasi</p>
            <h2 className="text-[#0d3d2b] text-3xl font-bold">Temukan Masjid Lathifah</h2>
            <p className="text-gray-500 text-sm mt-2">Masjid Jami&apos; Lathifah GSA</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
            <iframe
              title="Lokasi Masjid Jami' Lathifah GSA"
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full h-[320px] md:h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-[#0d3d2b] hover:bg-[#0a2e21] text-white font-semibold px-5 py-3 rounded-full transition-colors"
          >
            Buka navigasi Google Maps <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

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
            <p className="text-white/60 text-sm">Masjid Jami&apos; Lathifah GSA</p>
            <p className="text-white/60 text-sm">Gunung Sindur, Jawa Barat</p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-[#c9a84c] hover:text-white text-sm font-semibold transition-colors"
            >
              Lihat lokasi di Google Maps <span aria-hidden="true">→</span>
            </a>
          </div>
          <div>
            <p className="font-semibold mb-3 text-[#c9a84c]">Menu</p>
            {['Beranda','Jadwal','Tentang','Layanan','Berita','Galeri','Lokasi'].map(m => (
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